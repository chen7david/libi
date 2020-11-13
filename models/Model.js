const dd = (val) => console.log(val)
const p = require('path')
const fs = require('fs')
const Hotfile = require('hotfile')
const { pick } = require('lodash')
const defaults = require('./../default')
const inspectorConfig = require('stringspector')
const inspector = require('stringspector')(inspectorConfig)
const subsrt = require('subsrt')

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
        this.state = {}
        this.mask = Object.assign(defaults.mask, options.mask)
        this.keymap = Object.assign(defaults.keymap, options.keymap)
        this.graph = []
        this.queue = []
        this.cache = []
        this.path = {
            homedir: p.join(options.homedir + '/' + '@public', this.name),
            watchdir: p.join(options.watchdir || options.homedir, this.name),
        }
        this.homePath = () => this.path.homedir
        this.watchPath = () => this.path.watchdir
        this.mkdirSync(this.homePath())
        this.mkdirSync(this.watchPath())
        this.homeFolder = new Hotfile(this.homePath())
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
        let match = null, matches = null
        if(isNumer) match = await this.http().withId(name).get()
        if(!match){
            matches = await this.http().search(name, options)
            match = matches.length > 0 ? matches[0] : null
        }
        if(!match) {
            matches = await this.tmdb().search(name, options)
            match = matches.length > 0 ? await this.tmdb().withId(matches[0].id).get() : null
        }
        return match 
    }

    async import(){
        const items = await this.scandir(this.watchPath())
        let i = 0
        for(let item of items){
            const { year, id, query } = item.analyze()
            const search = id || item[this.className()] || query, options = {}
            if(year) options.year = year
            let match = await this.findOne(search, options)

            if(!match) continue

            if(this.className() == 'show'){
                match = await this.http().withId(match.id).get() 
                match.episodes = match.seasons.map(s => s.episodes).reduce((acc, curr) => acc.concat(curr))
            }

            match = this.renameKeys(match, (k, v) => {
                /* MUTATE MATCH OBJECT VALUES */
                if(k == 'year') v = new Date(v).getFullYear()
                if(k == 'name') v = v.replace(/:/g,' -')
                return v
            })

            const mask = this.renderMask(this.mask, match)
            const Folder = await this.homeFolder.createChildDir(mask[this.className()].folder)
            const files = this.filesThrough(item,  {id: match.id})

            this.addToCache(match)
            this.addToQueue(files)
            await this.processQueue(Folder) 
        }
        
        return this
    }

    async moveFile(item, mask, toFolder){
        if(item.type != 'subtitle'){
            await item.moveTo(toFolder, mask.file)
        }else{
            if(item.lang){
                const toPath = p.join(toFolder.path, mask.subtitle)
                this.tovtt(item.path, toPath)
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

    filesThrough(item, object = {}){
        const files = []
        function extract(item){
            if(item.isDirectory) {
                for(let child of item.children) extract(child)
            }else{
                files.push(Object.assign(item,object))
            }
        }
        extract(item, object)
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

    tovtt(fromPath, toPath){
        try {
            const input = fs.readFileSync(fromPath, 'utf8')
            const convereted = subsrt.convert(input, { format: 'vtt' })
            fs.writeFileSync(toPath, convereted)
        } catch (err) {
            dd({fromPath, err})
        }
    }
}

module.exports = Model
