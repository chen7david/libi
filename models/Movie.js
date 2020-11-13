const Model = require('./Model')
const { takeRight } = require('lodash')
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
        this.cache = this.cache.map(m => Object.assign(m, {videos:[], subtitles:[]}))
        for(let item of this.queue){
            const { id, type, lang } = item.analyze()
            let movie = this.getFromCache(id)
            const object = {}
            if(type == 'video'){
                object.type = 'video/mp4'
                object.src = '/' + takeRight(item.path.split('/'),2).join('/')
                movie.videos.push(object)
            }
            if(type == 'subtitle') {
                object.type = 'text/vtt'
                object.lang = lang
                object.src = '/' + takeRight(item.path.split('/'),2).join('/')
                movie.subtitles.push(object)
            }
        }
        return this.cache
    }
}

module.exports = Movie


// item = pick(item, Object.values(this.keymap))