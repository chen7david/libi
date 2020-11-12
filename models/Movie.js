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
            const { id, lang, ext, type } = item.analyze()
            const match = this.getFromCache(id)
            Object.assign(match, lang ? {lang} : {}, ext ? {ext} : {})
            const { movie } = this.renderMask(this.mask, match)
            const MovieFolder = await this.homeFolder.createChildDir(movie.folder)
            if(type != 'subtitle'){
                await item.moveTo(MovieFolder, movie.file)
            }else{
                await item.moveTo(MovieFolder, movie.subtitle)
            }
        }
        this.clearCache()
        this.clearQueue()
        dd('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
    }
}

module.exports = Movie