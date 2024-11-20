const {request} = require("../util");
const personalityType = "personalities";
const Personality = require('./models/Personality.js');
async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}
async function getPersonalitiesMetadata(spaceId){
    try {
        await this.sendRequest(`/personalities/${spaceId}/ensure-default-llms`, "POST");
    }catch(error){
        //ignore error
    }
    return await this.sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}`, "GET");
}
async function getPersonalities(spaceId){
    let personalities = await this.sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}/data`, "GET");
    return personalities.map(personality => new Personality(personality));
}

async function getPersonality(spaceId, fileName){
    let personality =  await this.sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}/${fileName}`, "GET");
    return new Personality(personality);
}

async function getPersonalityByName(spaceId, name){
    let metadataList = await this.getPersonalitiesMetadata(spaceId)
    let personalityId = metadataList.find(pers => pers.name === name).id;
    return await this.getPersonality(spaceId, personalityId);
}

async function getAgent(spaceId, agentId) {
    let url = `/spaces/${spaceId}/agents`;
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
async function exportPersonality(spaceId, personalityId){
    return await this.sendRequest(`/spaces/${spaceId}/export/personalities/${personalityId}`, "GET", this.__securityContext);
}
module.exports = {
    getPersonalitiesMetadata,
    getPersonality,
    addPersonality,
    updatePersonality,
    deletePersonality,
    sendRequest,
    getAgent,
    getPersonalities,
    getPersonalityByName,
    exportPersonality,
    models:{
        personality:require('./models/Personality.js'),
        agent:require('./models/Agent.js')
    }
}
