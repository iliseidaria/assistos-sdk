const sendRequest = require("assistos").loadModule("util").sendRequest;

const personalityType = "personalities";
async function getPersonalitiesMetadata(spaceId){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}`, "GET");
}
async function getPersonality(spaceId, personalityId){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}/${personalityId}`, "GET")
}
async function addPersonality(spaceId, personalityData){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}`, "POST", personalityData)
}
async function updatePersonality(spaceId, personalityId, personalityData){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}/${personalityId}`, "PUT", personalityData)
}
async function deletePersonality(spaceId, personalityId){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}/${personalityId}`, "DELETE")
}
module.exports = {
    getPersonalitiesMetadata,
    getPersonality,
    addPersonality,
    updatePersonality,
    deletePersonality
}