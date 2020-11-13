module.exports = {
    keymap: {
        title: 'name',
        first_air_date: 'year',
        release_date: 'year',
        season_number: '{s}',
        episode_number: '{e}',
        ext: 'ext',
        lang: 'lang',
        showname: 'shownm'
    },
    mask: {
        movie: {
            folder: 'name (year)',
            file: 'name (year).ext',
            subtitle: 'name (year).lang.vtt',
        },
        show: {
            folder: 'name (year)'
        },
        season: {
            folder: 'season - {s}'
        },
        episode: {
            file: 'shownm - {s}{e} - name.ext',
            subtitle: 'shownm - {s}{e} - name.lang.vtt',
        },
    }
}