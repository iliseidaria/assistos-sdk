const request = require("../util").request;
const {getAPIClient} = require("../util/utils");
const constants = require("../../constants");

async function sendRequest(url, method, data) {
    return await request(url, method, data, this.__securityContext);
}
async function getWidgets(spaceId) {
    let client = await getAPIClient("*", constants.APPLICATION_PLUGIN, spaceId);
    return await client.getWidgets();
}
async function installApplication(spaceId, applicationId) {
    let client = await getAPIClient("*", constants.APPLICATION_PLUGIN, spaceId);
    return await client.installApplication(applicationId);
}

async function uninstallApplication(spaceId, applicationId) {
    let client = await getAPIClient("*", constants.APPLICATION_PLUGIN, spaceId);
    return await client.uninstallApplication(applicationId);
}

async function getApplicationConfig(spaceId, applicationId) {
    //TODO: tons of requests when loading plugins in document page
    let client = await getAPIClient("*", constants.APPLICATION_PLUGIN, spaceId);
    return await client.loadApplicationConfig(applicationId);
}

async function getAvailableApps(spaceId) {
    let client = await getAPIClient("*", constants.APPLICATION_PLUGIN, spaceId);
    return await client.getAvailableApps();
}
async function getApplications(spaceId) {
    let client = await getAPIClient("*", constants.APPLICATION_PLUGIN, spaceId);
    return await client.getApplications();
}
async function runApplicationTask(spaceId, applicationId, taskName, taskData) {
    let client = await getAPIClient("*", constants.APPLICATION_PLUGIN, spaceId);
    return await client.runApplicationTask(taskName, taskData);
}
async function updateApplication(spaceId, applicationId) {
    let client = await getAPIClient("*", constants.APPLICATION_PLUGIN, spaceId);
    return await client.updateApplication(applicationId);
}
async function requiresUpdate(spaceId, applicationId) {
    let client = await getAPIClient("*", constants.APPLICATION_PLUGIN, spaceId);
    return await client.requiresUpdate(applicationId);
}
async function getApplicationFile(spaceId, applicationId, relativeAppFilePath) {
    const pathSegments = relativeAppFilePath.split('/').map(segment => encodeURIComponent(segment));
    const encodedPath = pathSegments.join('/');
    const pathParts = relativeAppFilePath.split(".");
    const type = pathParts[pathParts.length - 1].toLowerCase(); // Normalize file extension
    if (type !== "js") {
        let response = await fetch(`/applications/files/${spaceId}/${applicationId}/${encodedPath}`, {
            method: "GET",
            credentials: 'include'
        });
        return await response.text();
    } else {
        return await import(`/applications/files/${spaceId}/${applicationId}/${encodedPath}`);
    }
}
async function getApplicationTasks(spaceId, applicationId) {
    let client = await getAPIClient("*", constants.APPLICATION_PLUGIN, spaceId);
    return await client.getApplicationTasks(applicationId);
}
async function getApplicationsPlugins(spaceId) {
    let client = await getAPIClient("*", constants.APPLICATION_PLUGIN, spaceId);
    return await client.getApplicationsPlugins();
}

/*
async function storeAppObject(appName, objectType, objectId, stringData) {
    return await this.sendRequest(`/app/${assistOS.space.id}/applications/${appName}/${objectType}/${objectId}`, "PUT", stringData);
}
async function loadAppObjects(appName, objectType) {
    return await this.sendRequest(`/app/${assistOS.space.id}/applications/${appName}/${objectType}`, "GET");
}
*/


module.exports = {
    installApplication,
    getWidgets,
    uninstallApplication,
    getAvailableApps,
    getApplicationConfig,
    getApplicationFile,
    sendRequest,
    runApplicationTask,
    updateApplication,
    requiresUpdate,
    getApplicationTasks,
    getApplicationsPlugins,
    getApplications
};
