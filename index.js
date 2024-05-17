function detectEnvironment() {
    if (typeof fetch === 'function' && typeof document === 'object') {
        return 'browser';
    } else if (typeof require === 'function' && typeof module === 'object' && typeof module.exports === 'object') {
        return 'node';
    } else {
        return 'unknown';
    }
}
const envType = detectEnvironment();
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
        case 'util':
            return require('./modules/util');
        case 'llm':
            return require('./modules/llm');
        case 'application':
            return require('./modules/application');
        default:
            return null;
    }
}
module.exports = {
    loadModule: loadModule,
    constants: require('./constants.js'),
    envType
};