const dd = (val) => console.log(val)
const p = require('path')
const Libi = require('./index')({
    homedir: p.resolve('/Users/david/Desktop/media'),
    agent: require('meta-agent')({
        baseURL: 'http://192.168.50.251:8000',
    })
})

const library = Libi('movies')

const run = async () => {
    const items = await library.import()

    // const res = await library.http().search('nemo')
    // dd(res)
}

// const string = true ? 'hello' : '56470'
// dd(/^\d+$/.test(string))

// run()
// dd(library)
