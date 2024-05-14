const sendRequest = require("assistos").loadModule("util").sendRequest;

const personalityType = "personalities";
async function getPersonalitiesMetadata(spaceId){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}`, "GET");
}
async function getPersonality(spaceId, fileName){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}/${fileName}`, "GET")
}
async function getAgent(spaceId, agentId) {
    let url = '/spaces/${spaceId}/agents';
    if (agentId) {
        url += `/${agentId}`;
    }
    return await sendRequest(url, 'GET');
}

async function addPersonality(spaceId, personalityData){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}`, "POST", personalityData)
}
async function updatePersonality(spaceId, fileName, personalityData){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}/${fileName}`, "PUT", personalityData)
}
async function deletePersonality(spaceId, fileName){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}/${fileName}`, "DELETE")
}
async function loadFilteredKnowledge(spaceId, words, personalityId){
    return await sendRequest(`/personalities/${spaceId}/${personalityId}/search?param1=${words}`, "GET")
}
module.exports = {
    getPersonalitiesMetadata,
    getPersonality,
    addPersonality,
    updatePersonality,
    deletePersonality,
    loadFilteredKnowledge
}