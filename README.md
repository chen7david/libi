# libi

### Getting Started
```js
const p = require('path')
const Libi = require('libi')({
    homedir: p.resolve(__dirname, /* some path*/),
    watchdir: p.resolve(__dirname, /* some path*/), // optional
    http: 'meta-agent',
    mask: require('./mask')
})

const library = Libi('SomeMediaType', /* optional folder name */) // creates a library object
```

### Example Mask
```js
module.exports = {
    movie: {
        folder: 'name (year)',
        file: {
            mp4: 'name.ext',
            vtt: 'name.lang.ext',
            jpg: 'name.ext'
        }
    },
    show: {
        folder: 'name (year)',
        file: {
            mp4: 'name.ext'
        }
    },
    season: {
        folder: 'season - S00E000'
    },
    episode: {
        file: {
            mp4: 'name.ext',
            vtt: 'S00E000 - name.lang.ext'
        }
    },
}
```