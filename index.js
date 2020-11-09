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

    setMediaTypeTo(type){
        this.mediaType = type
        return this
    }

    getMask(func){
        const object = {
            folder: this.name,
            file: this.name + '.mp4'
        }
        return func(object)
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