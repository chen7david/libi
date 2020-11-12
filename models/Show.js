const Model = require('./Model')
const p = require('path')
const dd = (val) => console.log(val)

class Show extends Model {
    constructor(options = {}){
        super(options)
        this.http = () => this.agent.shows()
        this.tmdb = () => this.agent.tmdb().shows()
    }

    // async import(){
    //     const items = await this.scanFolder(this.watchPath())
    //     for(let item of items){
    //         const { show, year, id, query } = item.analyze()
    //         const search = id || show || query, options = {}
    //         if(year) options.year = year
    //         const match = await this.findOne(search, options)
    //         const mask = this.renameKeys(match, (k, v) => {
    //             /* MUTATE OBJECT VALUES */
    //             if(k == 'year') v = new Date(v).getFullYear()
    //             if(k == 's') v = padStart(v,2,'0')
    //             if(k == 'e') v = padStart(v,3,'0')
    //             return v
    //         })
    //         // const mask = this.getMask({movie, file:item})
    //         dd({mask})
    //     }
    // }

    async processQueue(){
        for(let item of this.queue){
            const { id, lang, ext, type } = item.analyze()
            dd({item})
            // const match = this.getFromCache(id)
            // Object.assign(match, lang ? {lang} : {}, ext ? {ext} : {})
            // const { movie } = this.renderMask(this.mask, match)
            // const MovieFolder = await this.homeFolder.createChildDir(movie.folder)
            // if(type != 'subtitle'){
            //     await item.moveTo(MovieFolder, movie.file)
            // }else{
            //     if(lang){
            //         const toPath = p.join(MovieFolder.path, movie.subtitle)
            //         this.tovtt(item.path, toPath)
            //     }
            // }
        }
        // this.clearCache()
        // this.clearQueue()
    }
}

module.exports = Show