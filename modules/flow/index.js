const sendRequest = require("assistos").loadModule("util").sendRequest;

const flowType = "flows";
async function getFlowsMetadata(spaceId){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${flowType}`, "GET");
}
async function getFlow(spaceId, flowName){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${flowType}/${flowName}`, "GET")
}
async function addFlow(spaceId, flowData){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${flowType}`, "POST", flowData)
}
async function updateFlow(spaceId, flowName, flowData){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${flowType}/${flowName}`, "PUT", flowData)
}
async function deleteFlow(spaceId, flowName){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${flowType}/${flowName}`, "DELETE")
}