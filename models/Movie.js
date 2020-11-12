const Model = require('./Model')
const dd = (val) => console.log(val)

class Movie extends Model {
    constructor(options = {}){
        super(options)
        this.http = () => this.agent.movies()
        this.tmdb = () => this.agent.tmdb().movies()
    }

    async processQueue(){
        for(let item of this.queue){
            const { movie, year, id, query, lang, ext, type } = item.analyze()
            const match = this.getFromCache(id)
            Object.assign(match, lang ? {lang} : {}, ext ? {ext} : {})
            const mask = this.renderMask(this.mask, match)
            dd({movie, year, id, query, lang, ext, type, match, mask})
        }
        // const { movie, year, id, query, lang, ext, type } = item.analyze()
        //     const search = id || movie || query, options = {}
        //     if(year) options.year = year
        //     let match = await this.findOne(search, options)
        //     if(!match) return null
        //     Object.assign(match, lang ? {lang} : {}, ext ? {ext} : {})
        //     match = this.renameKeys(match, (k, v) => {
        //         /* MUTATE MATCH OBJECT VALUES */
        //         if(k == 'year') v = new Date(v).getFullYear()
        //         return v
        //     })
        //     const mask = this.renderMask(this.mask, match)
        //     const files = this.filesThrough(item) 
        //     dd({mask, files})
        this.clearCache()
        this.clearQueue()
        dd('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    }
}

module.exports = Movie