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
        default:
            return null;
    }
}
