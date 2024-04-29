const sendRequest = require("assistos").loadModule("util").sendRequest;

async function loadFlows(spaceId){
    return await import(`/spaces/flows/${spaceId}`);
}
async function getFlow(spaceId, flowName){
    return await import(`/spaces/flows/${spaceId}/${flowName}`);
}
async function addFlow(spaceId, flowName, flowData){
    return await sendRequest(`/spaces/flows/${spaceId}/${flowName}`, "POST", flowData)
}
async function updateFlow(spaceId, flowName, flowData){
    return await sendRequest(`/spaces/flows/${spaceId}/${flowName}`, "PUT", flowData)
}
async function deleteFlow(spaceId, flowName){
    return await sendRequest(`/spaces/flows/${spaceId}/${flowName}`, "DELETE")
}
module.exports = {
    getFlow,
    loadFlows,
    addFlow,
    updateFlow,
    deleteFlow
}