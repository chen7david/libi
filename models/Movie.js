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
            await this.moveFile(item, movie, Folder)
        }
        this.clearCache()
        this.clearQueue()
    }

    buildGraph(){
        const movies = []
        for(let file of this.queue){
            const { type } = file.analyze()
            dd({file})
        }
    }
}

module.exports = Movie