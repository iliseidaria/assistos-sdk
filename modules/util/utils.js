const constants = require("../../constants");

async function getAPIClient(userId, pluginName, serverlessId, options = {}){
    if(!serverlessId){
        serverlessId = constants.GLOBAL_SERVERLESS_ID;
    }

    if(typeof serverlessId === "object"){
        options = serverlessId;
        serverlessId = constants.GLOBAL_SERVERLESS_ID;
    }
    let openDSU = require("opendsu");
    let system = openDSU.loadAPI("system");
    const baseURL = system.getBaseURL();
    return await openDSU.loadAPI("serverless").createServerlessAPIClient(userId, baseURL, serverlessId, pluginName, "", options);
}
module.exports = {
    getAPIClient
}