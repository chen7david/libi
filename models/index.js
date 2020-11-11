
module.exports = (options = {}) => (type, name) => {
    if(!type) throw('library name is required!')
    let model = null
    switch (type) {
        case 'movies':
            model = require('./movie')
            break;
        case 'shows':
            model = require('./show')
            break;
        default:
            throw(`media type ${type} is not supported! the ${types.length} supported types are: ` + types.join(', ') + '.')
            break;
    }
    if(!types.includes(type))
        
    options.name = name || type
    options.mediaType = type
    return new model(options)
}