module.exports = {
    loadModule: function(moduleName) {
        switch (moduleName) {
            case 'document':
                return require('./modules/document');
            case 'space':
                return require('./modules/space');
            case 'user':
                return require('./modules/user');
            case 'services':
                return require('./modules/email');
            default:
                return null;
        }
    },
    constants: require('./constants.js'),
};
