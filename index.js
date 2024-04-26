module.exports = {
    loadModule: loadModule,
    constants: require('./constants.js'),
};
 function loadModule(moduleName) {
    switch (moduleName) {
        case 'document':
            return require('./modules/document');
        case 'space':
            return require('./modules/space');
        case 'user':
            return require('./modules/user');
        case 'personality':
            return require('./modules/personality');
        case 'flow':
            return require('./modules/flow');
        default:
            return null;
    }
}
