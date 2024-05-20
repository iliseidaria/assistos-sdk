const ServerSideSecurityContext = require('./modules/user/models/ServerSideSecurityContext');
const ClientSideSecurityContext = require('./modules/user/models/ClientSideSecurityContext');
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
function _loadModule(moduleName) {
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
function sdkModule(moduleName, securityContext) {
    let module = _loadModule(moduleName);
    this.__securityContext = securityContext;
    for(let key in module){
        if(typeof module[key] === 'function' && typeof module[key].constructor !== "function"){
            this[key] = module[key].bind(this);
        } else{
            this[key] = module[key];
        }
    }
    return this;
}
function loadModule(moduleName, userContext){
    if(!userContext){
        throw new Error("User context is required to load a module");
    }
   return new sdkModule(moduleName, userContext);
}
module.exports = {
    loadModule: loadModule,
    constants: require('./constants.js'),
    envType,
    ServerSideSecurityContext,
    ClientSideSecurityContext
};