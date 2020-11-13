const dd = (val) => console.log(val)
const p = require('path')
const Koa = require('koa')
const cors = require('kcors')
const app = new Koa()
const Libi = require('./index')({
    homedir: p.resolve('/Users/david/Desktop/media'),
    agent: require('meta-agent')({
        // baseURL: 'http://192.168.50.251:8000',
        baseURL: 'http://aox.hopto.org:8000',
    })
})

const library = Libi('movies')
let i = 0
const run = async (ctx) => {
    dd({i})
    const res = await library.updateGraph()
    ctx.body = library
    i++
}
app.use(cors())
app.use(run)

app.listen(4000)

