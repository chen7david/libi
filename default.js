module.exports = {
    keymap: {
        title: 'name',
        first_air_date: 'year',
        release_date: 'year',
        season_number: 's',
        episode_number: 'e',
    },
    mask: {
        movie: {
            folder: 'name (year)',
            file: 'name.ext',
        },
        show: {
            folder: 'name (year)'
        },
        season: {
            folder: 'season - S00E000'
        },
        episode: {
            file: 'S00E000 - name.ext'
        }, 
    }
}