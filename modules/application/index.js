const sendRequest = require("assistos").loadModule("util").sendRequest;

async function installApplication(spaceId, applicationId) {
    return await sendRequest(`/space/${spaceId}/applications/${applicationId}`, "POST");
}

async function getApplicationConfigs(spaceId, appId) {
    return await sendRequest(`/space/${spaceId}/applications/${appId}/configs`, "GET");
}

async function getApplicationFile(spaceId, appId, relativeAppFilePath) {
    const pathParts = relativeAppFilePath.split(".")
    const type = pathParts[pathParts.length - 1] || "";
    if (type !== "js") {
        let response = await fetch(`/app/${spaceId}/applications/${appId}/file/${relativeAppFilePath}`, {method:"GET"});
        return await response.text();
    }else{
        return await import(`/app/${spaceId}/applications/${appId}/file/${relativeAppFilePath}`);
    }
}

async function storeAppObject(appName, objectType, objectId, stringData) {
    return await sendRequest(`/app/${assistOS.space.id}/applications/${appName}/${objectType}/${objectId}`, "PUT", stringData);
}

async function loadAppObjects(appName, objectType) {
    return await sendRequest(`/app/${assistOS.space.id}/applications/${appName}/${objectType}`, "GET");
}

async function uninstallApplication(spaceId, appName) {
    return await sendRequest(`/space/${spaceId}/applications/${appName}`, "DELETE");
}
async function loadAppFlows(spaceId, appId){
    return import(`/app/${spaceId}/applications/${appId}`);
}
async function loadApplicationsMetadata(spaceId){
    return await sendRequest(`/app/${spaceId}`, "GET");
}
const Application = require("./models/Application.js");
module.exports = {
    installApplication,
    getApplicationConfigs,
    getApplicationFile,
    storeAppObject,
    loadAppObjects,
    uninstallApplication,
    loadAppFlows,
    loadApplicationsMetadata,
    Application
};