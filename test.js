const dd = (val) => console.log(val)
const p = require('path')
const Libi = require('./index')({
    homedir: p.resolve('/Users/david/Desktop/media'),
    http: 'meta-agent'
})

const library = Libi('movies')

const run = async () => {
    const items = await library.import()
    // dd({x:items[0].analyze()})
}

const string = true ? 'hello' : '56470'
dd(/^\d+$/.test(string))

run()
// dd(library)
