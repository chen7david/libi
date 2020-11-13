const dd = (val) => console.log(val)
const p = require('path')
const fs = require('fs')
const Hotfile = require('hotfile')
const { pick } = require('lodash')
const defaults = require('./../default')
const inspectorConfig = require('stringspector')
const inspector = require('stringspector')(inspectorConfig)
const subsrt = require('subsrt')
const strTovtt = require('srt-to-vtt')
const Filee = require('filee')

Hotfile.prototype.analyze = function () {
    const string = this.basename
    const metadata = inspector.loadString(string).filter().inspect().get()
    Object.assign(this, metadata)
    return this
}

class Model {
    constructor(options){
        this.name = options.name
        this.agent = options.agent
        this.overwrite = false
        this.state = {}
        this.mask = Object.assign(defaults.mask, options.mask)
        this.keymap = Object.assign(defaults.keymap, options.keymap)
        this.queue = []
        this.cache = []
        this.path = {
            homedir: p.join(options.homedir + '/' + '@public', this.name),
            watchdir: p.join(options.watchdir || options.homedir, this.name),
            graph: p.join(options.homedir + '/' + '@public', this.name, this.name + '.graph')
        }
        this.homePath = () => this.path.homedir
        this.watchPath = () => this.path.watchdir
        this.graphPath = () => this.path.graph
        this.mkdirSync(this.homePath())
        this.mkdirSync(this.watchPath())
        this.homeFolder = new Hotfile(this.homePath())
    }
   
    async graph(){
        const graph = await Filee.load(this.graphPath())
        await graph.read()
        return graph ? graph.getContent() : []  
    }

    force(){
        this.overwrite = true
    }

    normalizeString(string){
        return string.toLowerCase().match(/[\w'-]+/g)
    }

    className(){
        return this.constructor.name.toLowerCase()
    }
        
    mkdirSync(path){
        try {fs.mkdirSync(path, {recursive: true}); return true} 
        catch (err) { return false}
    }

    async findOne(name, options = {}){
        let isNumer = /^\d+$/.test(name)
        let match = null, matches = null, search = name.replace(/ -/g,':').replace(/  +/g, ' ')
        if(isNumer) match = await this.http().withId(name).get()
        if(!match){
            matches = await this.http().search(search, options)
            match = matches.length > 0 ? matches[0] : null
            dd({msrg:'looking for internal source ...', matches, search, options})
        }
        if(!match) {
            matches = await this.tmdb().search(search, options)
            match = matches.length > 0 ? await this.tmdb().withId(matches[0].id).get() : null
            dd({msrg:'looking for external source ...', matches, search, options})
        }
        if(match && this.className() == 'show'){
            match = await this.http().withId(match.id).get() 
            match.episodes = match.seasons.map(s => s.episodes).reduce((acc, curr) => acc.concat(curr))
        }
        return match 
    }

    async updateGraph(){
        const items = await this.scandir(this.homePath())
        for(let item of items) {
            const { year, id, query } = item.analyze()
            let search = id || item[this.className()] || query, options = {}
            if(year) search = search.replace(year,'')
            if(year) options.year = year
            let match = await this.findOne(search, options)
            if(!match) continue
            const allowed = ['.mp4', '.vtt']
            const files = this.filesThrough(item, (i) => {
                if(allowed.includes(i.ext))return Object.assign(i, {id: match.id})
            })
            this.addToCache(match)
            this.addToQueue(files)
        }
        const graph = this.buildGraph()
        const file = await Filee.create(this.graphPath())
        await file.update(graph).save() 
        this.clearCache()
        this.clearQueue()
        return graph
    }

    async import(){
        const items = await this.scandir(this.watchPath())
        for(let item of items){
            const { year, id, query } = item.analyze()
            let search = id || item[this.className()] || query, options = {}
            if(year) search = search.replace(year,'')
            if(year) options.year = year
            let match = await this.findOne(search, options)
            if(!match) continue

            match = this.renameKeys(match, (k, v) => {
                /* MUTATE MATCH OBJECT VALUES */
                if(k == 'year') v = new Date(v).getFullYear()
                if(k == 'name') v = v.replace(/:/g,' -')
                return v
            })

            const mask = this.renderMask(this.mask, match)
            const Folder = await this.homeFolder.createChildDir(mask[this.className()].folder)
            const allowed = ['.mp4', '.m4v'].concat(inspectorConfig.extensions.subtitle)
            const files = this.filesThrough(item, (i) => {
                if(allowed.includes(i.ext))return Object.assign(i, {id: match.id})
            })

            this.addToCache(match)
            this.addToQueue(files)
            await this.processQueue(Folder) 
        }
        
        return this
    }

    async moveFile(item, mask, toFolder){
        if(item.type != 'subtitle'){
            if(item.ext == '.m4v') mask.file = mask.file.replace('.m4v','.mp4')
            await item.moveTo(toFolder, mask.file)
        }else{
            if(item.lang){
                const fromPath = item.path
                const toPath = p.join(toFolder.path, mask.subtitle)
                switch (item.ext) {
                    case '.srt':
                        await this.srt2vtt(fromPath, toPath)
                        break;
                    // case '.ass':
                    //     await this.ass2vtt(fromPath, toPath)
                    //     break;
                    default:
                        this.tovtt(fromPath, toPath)
                        break;
                }
            }
        }
    }

    addToCache(item){
        if(this.getFromCache(item.id)) return true
        this.cache.push(item)
    }

    getFromCache(id){
        return this.cache.find(e => e.id == id)
    }

    clearCache(){
        this.cache = []
        return this
    }

    addToQueue(item){
       Array.isArray(item) ? this.queue = this.queue.concat(item) : this.queue.push(item)
       return this
    }

    clearQueue(){
        this.queue = []
        return this
    }

    async scandir(path){
        return await Hotfile.map(path,{exclude: /(^|\/)\.[^\/\.]/g})
    }

    filesThrough(item, func){
        const files = []
        function extract(item){
            if(item.isDirectory) {
                for(let child of item.children) extract(child, func)
            }else{
                const file = func ? func(item) : item
                if(file) files.push(file)
            }
        }
        extract(item, func)
        return files
    }

    /* Mask Manager */

    renderMask(mask, object){
        let string = JSON.stringify(mask)
        object = pick(object, Object.values(this.keymap))
        Object.keys(object).map(key => {
            let value = object[key]
            let regex = new RegExp(`${key}`,'g')
            if(key == 'ext') value = value.replace('.', '')
            string = string.replace(regex, value)
        })
        return JSON.parse(string)
    }

    renameKeys(a = {}, func){
        const b = {}
        for(let k in a){
            let v = a[k]
            k = this.keymap[k] || k
            if(func) v = func(k, v) 
            b[k] = v
        }
        return b
    }

    async srt2vtt(sourcePath, destPath){
        try {
            if(!await Hotfile.exists(destPath) || this.overwrite) {
                await fs.createReadStream(sourcePath)
                .pipe(strTovtt())
                .pipe(fs.createWriteStream(destPath))
            }else{
                console.log({message: `sub already exists for ...${destPath}`})
            }
        } catch (err) {
            console.log(err, {message: `sub error for ...${destPath}`})
        }
    }

    // async ass2vtt(sourcePath, destPath){
    //     try {
    //         if(!await Hotfile.exists(destPath) || this.overwrite) {
    //             await fs.createReadStream(sourcePath)
    //             .pipe(assTovtt())
    //             .pipe(fs.createWriteStream(destPath))
    //         }else{
    //             console.log({message: `sub already exists for ...${destPath}`})
    //         }
    //     } catch (err) {
    //         console.log({err, message: `sub error for ...${destPath}`})
    //     }
    // }

    tovtt(fromPath, toPath){
        try {
            const input = fs.readFileSync(fromPath, 'utf8')
            const convereted = subsrt.convert(input, { format: 'vtt' })
            fs.writeFileSync(toPath, convereted)
        } catch (err) {
            dd({err, fromPath})
        }
    }
}

module.exports = Model
