const Model = require('./Model')
const p = require('path')
const dd = (val) => console.log(val)

class Movie extends Model {
    constructor(options = {}){
        super(options)
        this.http = () => this.agent.movies()
        this.tmdb = () => this.agent.tmdb().movies()
    }

    async processQueue(Folder){
        for(let item of this.queue){
            const { id, lang, ext, type } = item.analyze()
            const match = this.getFromCache(id)
            Object.assign(match, lang ? {lang} : {}, ext ? {ext} : {})
            const { movie } = this.renderMask(this.mask, match)
            if(type != 'subtitle'){
                await item.moveTo(Folder, movie.file)
            }else{
                if(lang){
                    const toPath = p.join(Folder.path, movie.subtitle)
                    this.tovtt(item.path, toPath)
                }
            }
        }
        this.clearCache()
        this.clearQueue()
    }
}

module.exports = Movie