const dd = (val) => console.log(val)
const p = require('path')
const Libi = require('./index')({
    homedir: p.resolve('/Users/davidchen/Desktop/media'),
    agent: require('meta-agent')({
        baseURL: 'http://192.168.50.251:8000',
    })
})

const library = Libi('movies')
const run = async () => {
    const res = await library.import()
    // dd(res)
}

run()
