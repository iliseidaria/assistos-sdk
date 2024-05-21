const {request} = require("../util");
const personalityType = "personalities";
async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}
async function getPersonalitiesMetadata(spaceId){
    return await this.sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}`, "GET");
}
async function getPersonality(spaceId, fileName){
    return await this.sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}/${fileName}`, "GET");
}
async function getAgent(spaceId, agentId) {
    let url = '/spaces/${spaceId}/agents';
    if (agentId) {
        url += `/${agentId}`;
    }
    return await this.sendRequest(url, 'GET');
}

async function addPersonality(spaceId, personalityData){
    return await this.sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}`, "POST", personalityData, this.__securityContext);
}
async function updatePersonality(spaceId, fileName, personalityData){
    return await this.sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}/${fileName}`, "PUT", personalityData, this.__securityContext);
}
async function deletePersonality(spaceId, fileName){
    return await this.sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}/${fileName}`, "DELETE", this.__securityContext);
}
async function loadFilteredKnowledge(spaceId, words, personalityId){
    return await this.sendRequest(`/personalities/${spaceId}/${personalityId}/search?param1=${words}`, "GET", this.__securityContext);
}
module.exports = {
    getPersonalitiesMetadata,
    getPersonality,
    addPersonality,
    updatePersonality,
    deletePersonality,
    loadFilteredKnowledge,
    sendRequest
}