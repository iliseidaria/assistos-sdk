const sendRequest = require("assistos").loadModule("util").sendRequest;

const personalityType = "personalities";
async function getPersonalitiesMetadata(spaceId){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}`, "GET");
}
async function getPersonality(spaceId, fileName){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}/${fileName}`, "GET")
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
module.exports = {
    getPersonalitiesMetadata,
    getPersonality,
    addPersonality,
    updatePersonality,
    deletePersonality
}