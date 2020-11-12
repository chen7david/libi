module.exports = {
    keymap: {
        title: 'name',
        first_air_date: 'year',
        release_date: 'year',
        season_number: '{s}',
        episode_number: '{e}',
        ext: 'ext',
        lang: 'lang'
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
            file: 'S{s}E{e} - name.ext',
            subtitle: 'name.lang.vtt',
        },
    }
}