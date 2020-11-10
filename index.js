const dd = (val) => console.log(val)
const p = require('path')

class Library {
    constructor(options){
        this.name = options.name
        this.mediaType = options.mediaType
        this.stat = {}
        this.mask = options.mask
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

    renderMask(data){
        for(let items in collection)
            for(let item  in collection[items])
                for(let i  in collection[items][item])
                    for(let key in map) collection[items][item][i] = collection[items][item][i].replace(key, map[key])
        return mask
    }


    /* private functions */

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