module.exports = {
    keymap: {
        title: 'name',
        first_air_date: 'year',
        release_date: 'year',
        season_number: '{s}',
        episode_number: '{e}',
    },
    mask: {
        movie: {
            folder: 'name (year)',
            file: 'name.ext',
            subtitle: 'name.lang.ext'
        },
        show: {
            folder: 'name (year)'
        },
        season: {
            folder: 'season - {s}'
        },
        episode: {
            file: 'S{s}E{e} - name.ext',
            subtitle: 'S{s}E{e} - name.lang.ext'
        }, 
    }
}