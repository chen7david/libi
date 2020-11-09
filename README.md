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

#### Watch Path
<p>
If a <code>watch-path</code> is not chosen, an import folder containing your watch folder(s) will automatically be created in the folder where you have pointed your home directory to. If a direcotry already exists with that name it will instead work from that directory. Note that it will not overide any folders or files that already exist.
</p>


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