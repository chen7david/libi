const dd = (val) => console.log(val)
const p = require('path')
const { deburr, padStart } = require('lodash')
const defaults = require('./default')

class Library {
    constructor(options){
        this.name = options.name
        this.mediaType = options.mediaType
        this.stat = {}
        this.mask = Object.assign(defaults.mask, options.mask)
        this.keymap = Object.assign(defaults.keymap, options.keymap)
        this.path = {
            homedir: p.join(options.homedir, this.name),
            watchdir: p.join(options.watchdir || options.homedir + '/' + 'import', this.name),
        }
        this.http = options.http
        this.graph = []
        this.queue = []
    }

    addToQueue(item){
        this.queue.push(item)
        return this
    }

    getMask(data){
        const { ext, lang } = data.file
        const m = this.mapkeys(data, { ext, lang }, (k, v) => {
            if(k == 'year') v = new Date(v).getFullYear()
            if(k == defaults.keymap['season_number']) v = padStart(v,2,'0')
            if(k == defaults.keymap['episode_number']) v = padStart(v,3,'0')
            return v
        })
        const rendered = this.renameObjectKeys(this.mask,{}, (k, v) => {
                const match = m[k]
                for(let i in v){
                    let string = v[i]
                    for(let key in match) string = string.replace(key, match[key])
                    v[i] = string
                }
            return v
        })
        return rendered
    }

    /* private functions */

    mapkeys(data, object, func){
        return this.renameObjectsKeys(data, this.keymap, object, func)
    }

    renameObjectsKeys(data, keymap = {}, func){
        for(let key in data){
            data[key] = this.renameObjectKeys(data[key], keymap, func)
        }
        return data
    }

    renameObjectKeys(a = {}, keymap = {}, func){

        const b = {}
    
        for(let k in a){
            let v = a[k]
            k = keymap[k] || k
            if(func) v = func(k, v) 
            b[k] = v
        }
    
        return b
    }
}

module.exports = (options = {}) => (type, name) => {
    if(!type) throw('library name is required!')
    const types = ['movies', 'shows']
    if(!types.includes(type)) 
        throw(`media type ${type} is not supported! the ${types.length} supported types are: ` + types.join(', ') + '.')
    options.name = name || type
    options.mediaType = type
    return new Library(options)
}