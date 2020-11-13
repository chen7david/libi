const Model = require('./Model')
const { padStart } = require('lodash')
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

    normalizeString(string){
        return string.toLowerCase().match(/[\w'-]+/g)
    }

    async processQueue(){
        let i = 0
        dd({smg: `lets start again with i = ${i}`})
        for(let item of this.queue){
            const { id, lang, ext, type, episode: {s, e} } = item.analyze()
            let show = this.getFromCache(id) 
            if(!show) continue
            let episode = item.episode ? 
                show.episodes.find(ep => ep.season_number == s && ep.episode_number == e) :
                show.episodes.find(ep => this.normalizeString(ep.name).every(k => item.basename.toLowerCase().match(/[\w'-]+/g).join(' ').includes(k)))
            if(!episode) continue
            const showmask = this.renderMask(this.mask, show).show
            const ShowFolder = await this.homeFolder.createChildDir(showmask.folder)
            Object.assign(episode, lang ? {lang} : {}, ext ? {ext} : {}, {showname: show.name})
            dd({episode})
            episode = this.renameKeys(episode, (k, v) => {
                /* MUTATE MATCH OBJECT VALUES */
                if(k == '{s}') v = 'S' + padStart(v,2,'0')
                if(k == '{e}') v = 'E' + padStart(v,3,'0')
                if(k == 'showname') v = v.replace(/:/g,' -')
                if(k == 'name') v = v.replace(/:/g,' -')
                return v
            })
            const mask = this.renderMask(this.mask, episode)
            const SeasonFolder = await ShowFolder.createChildDir(mask.season.folder)
            dd({mask})
            if(type != 'subtitle'){
                await item.moveTo(SeasonFolder, mask.episode.file)
            }else{
                if(lang){
                    const toPath = p.join(SeasonFolder.path, mask.episode.subtitle)
                    this.tovtt(item.path, toPath)
                }
            }
            i+= 1
        }
        dd({msg:`${i} file(s) proccessed`})
        dd('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
        this.clearCache()
        this.clearQueue()
    }
}

module.exports = Show