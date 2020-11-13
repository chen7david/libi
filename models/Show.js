const Model = require('./Model')
const { padStart, takeRight } = require('lodash')
const p = require('path')
const dd = (val) => console.log(val)

class Show extends Model {
    constructor(options = {}){
        super(options)
        this.http = () => this.agent.shows()
        this.tmdb = () => this.agent.tmdb().shows()
    }

    async processQueue(Folder){
        for(let item of this.queue){
            const { id, lang, ext, type } = item.analyze()
            let show = this.getFromCache(id) 
            if(!show) continue
            let episode = item.episode ? 
                show.episodes.find(ep => ep.season_number == item.episode.s && ep.episode_number == item.episode.e) :
                show.episodes.find(ep => this.normalizeString(ep.name).every(k => this.normalizeString(item.basename).join(' ').includes(k)))
            if(!episode) continue
            Object.assign(episode, lang ? {lang} : {}, ext ? {ext} : {}, {showname: show.name})
            episode = this.renameKeys(episode, (k, v) => {
                /* MUTATE MATCH OBJECT VALUES */
                if(k == '{s}') v = 'S' + padStart(v,2,'0')
                if(k == '{e}') v = 'E' + padStart(v,3,'0')
                if(k == 'showname') v = v.replace(/:/g,' -')
                if(k == 'name') v = v.replace(/:/g,' -')
                return v
            })
            const mask = this.renderMask(this.mask, episode)
            const SeasonFolder = await Folder.createChildDir(mask.season.folder)
            await this.moveFile(item, mask.episode, SeasonFolder)
        }
        this.clearCache()
        this.clearQueue()
    }

    buildGraph(){
        for(let item of this.queue){
            const { id, type, lang, episode:{ s, e } } = item.analyze()
            let show = this.getFromCache(id)
            if(!show) continue
            let season = show.seasons.find(sn => sn.season_number == s)
            if(!season) continue
            let episode = season.episodes.find(ep => ep.episode_number == e)
            if(!episode.videos) Object.assign(episode, {videos:[], subtitles:[]})
            const object = {}
            if(type == 'video'){
                object.type = 'text/vtt'
                object.src = '/' + takeRight(item.path.split('/'),2).join('/')
                episode.videos.push(object)
            }
            if(type == 'subtitle') {
                object.lang = lang
                object.type = 'video/mp4'
                object.src = '/' + takeRight(item.path.split('/'),2).join('/')
                episode.subtitles.push(object)
            }
        }
        for(let show of this.cache){
            delete show.episodes
            for(let season of show.seasons){
                season.episodes = season.episodes.filter(ep => ep.videos || ep.subtitles)
            }
        }
        return this.cache
    }
}

module.exports = Show

// this.cache = this.cache.map(show => Object.assign(m, {videos:[], subtitles:[]}))