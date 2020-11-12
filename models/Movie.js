const Model = require('./Model')
const dd = (val) => console.log(val)

class Movie extends Model {
    constructor(options = {}){
        super(options)
        this.http = () => this.agent.movies()
        this.tmdb = () => this.agent.tmdb().movies()
    }

    async createBatch(item){
        const { movie, year, id, query, lang, ext, type } = item
            const search = id || movie || query, options = {}
            if(year) options.year = year
            let match = await this.findOne(search, options)
            if(!match) return null
            Object.assign(match, lang ? {lang} : {}, ext ? {ext} : {})
            match = this.renameKeys(match, (k, v) => {
                /* MUTATE MATCH OBJECT VALUES */
                if(k == 'year') v = new Date(v).getFullYear()
                return v
            })
            const mask = this.renderMask(this.mask, match)
            dd({mask})
    }
}

module.exports = Movie