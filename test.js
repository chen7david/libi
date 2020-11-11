const dd = (val) => console.log(val)
const p = require('path')
const agent = require('meta-agent')({
    baseURL: 'http://192.168.50.251:8000',
})
const Libi = require('./index')({
    homedir: p.resolve('/Users/david/Desktop/media'),
    agent,
})

const library = Libi('shows')

const run = async () => {
    // const items = await library.import()
    const res = await library.findOne('85948')
    dd(res)
}

const string = true ? 'hello' : '56470'
dd(/^\d+$/.test(string))

run()
// dd(library)
