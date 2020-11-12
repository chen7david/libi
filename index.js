const models = {
    movies: require('./models/Movie'),
    shows: require('./models/Show')
}

const types = Object.keys(models)
module.exports = (options = {}) => (type, name) => {
    if(!type) throw('library name is required!')
    if(!types.includes(type))
        throw(`media type ${type} is not supported! the ${types.length} supported types are: ` + types.join(', ') + '.')
    options.name = name || type
    return new models[type](options)
}