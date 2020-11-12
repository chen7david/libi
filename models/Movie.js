const Model = require('./Model')
const dd = (val) => console.log(val)

class Movie extends Model {
    constructor(options = {}){
        super(options)
        this.http = () => this.agent.movies()
        this.tmdb = () => this.agent.tmdb().movies()
    }

    async processBatch(item){
        const { movie, year, id, query } = item
            const search = id || movie || query, options = {}
            if(year) options.year = year
            const match = await this.findOne(search, options)
            const mask = this.renameKeys(match, (k, v) => {
                /* MUTATE MATCH OBJECT VALUES */
                if(k == 'year') v = new Date(v).getFullYear()
                return v
            })
            dd({mask})
    }
}

module.exports = Movie