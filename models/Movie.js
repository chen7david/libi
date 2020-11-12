const Model = require('./Model')
const dd = (val) => console.log(val)

class Movie extends Model {
    constructor(options = {}){
        super(options)
        this.http = () => this.agent.movies()
        this.tmdb = () => this.agent.tmdb().movies()
    }

    async createBatch(item){
        const { movie, year, id, query } = item
            dd(item)
            const search = id || movie || query, options = {}
            if(year) options.year = year
            let match = await this.findOne(search, options)
            match = this.renameKeys(match, (k, v) => {
                /* MUTATE MATCH OBJECT VALUES */
                if(k == 'year') v = new Date(v).getFullYear()
                return v
            })
            dd({match})
    }
}

module.exports = Movie