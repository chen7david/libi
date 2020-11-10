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
If a <code>watch-path</code> is not chosen, an import folder containing your watch folder(s) will automatically be created in the folder where you have pointed your home directory to. If a directory already exists with that name it will instead work from that directory. Note that it will not overide any folders or files that already exist.
</p>


#### Media Type
<p>
Currently there are 2 supported media types: movies, and shows.
If a <code>folder name</code> is not provided at instantiation, a library folder will be created with the name of the media type instead of a unique name.
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

### Example Keymap
This map renames all the fields in the matched metadata object that was returned by your agent accordingly.
```js
module.exports = {
    title: 'name',
    first_air_date: 'year',
    release_date: 'year',
    season_number: 's',
    episode_number: 'e',
}
```

### API
```js
const matches = {

}
const commonObj = {ext: '.mp4', lang:'en'}

const valueMutator = (k, v) => {

    /*
        key and value for each object property are given as the object is being itterated.
        You can modify the property values here ...
    */

    if(k == 'year') v = new Date(v).getFullYear()
    return v
}

const data = library.mapkeys(matches, commonObj, valueMutator)
```