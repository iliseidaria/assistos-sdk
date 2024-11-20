const {request} = require("../util");
const personalityType = "personalities";

async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}

async function getPersonality(spaceId, fileName) {
    const Personality = require("../personality/models/Personality");
    let personality;
    if (fileName) {
        try {
            personality = await this.sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}/${fileName}`, "GET");
        } catch (error) {
            personality = await this.getDefaultPersonality(spaceId);
        }
    } else {
        personality = await this.getDefaultPersonality(spaceId);
    }
    return new Personality(personality);
}

async function getDefaultPersonality(spaceId) {
    const Personality = require("../personality/models/Personality");
    const personality = await this.sendRequest(`/personalities/default/${spaceId}`, "GET");
    return new Personality(personality);
}

async function generateText(spaceId, prompt, personalityName) {
    const personality = await this.getPersonality(spaceId, personalityName)
    return await personality.generateText(spaceId, prompt);
}

async function getChatCompletion(spaceId, chat,personalityName, injectPersonalityAsSysPrompt = false) {
    const personality = await this.getPersonality(spaceId, personalityName);
    return await personality.getChatCompletion(spaceId, chat, injectPersonalityAsSysPrompt);
}

async function textToSpeech(spaceId, modelConfigs, personalityName) {
    const personality = await this.getPersonality(spaceId, personalityName);
    return await personality.textToSpeech(spaceId, modelConfigs);
}

async function generateImage(spaceId, modelConfigs, personalityName) {
    const personality = await this.getPersonality(spaceId, personalityName);
    return await personality.generateImage(spaceId, modelConfigs);
}

async function editImage(spaceId, modelName, options, personalityName) {
    const personality = await this.getPersonality(spaceId, personalityName);
    return await personality.editImage(spaceId, modelName, options);
}

async function lipSync(spaceId, taskId, videoId, audioId, configs, personalityName) {
    const personality = await this.getPersonality(spaceId, personalityName);
    return await personality.lipSync(spaceId, taskId, videoId, audioId, configs);
}

async function listVoices(spaceId) {
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/audio/listVoices`, "GET");
}

async function listEmotions(spaceId) {
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/audio/listEmotions`, "GET");
}

async function getLLMConfigs(spaceId) {
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/configs`, "GET");
}

async function listLlms(spaceId) {
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms`, "GET");
}

async function getDefaultModels() {
    return await this.sendRequest(`/apis/v1/llms/defaults`, "GET");
}

module.exports = {
    generateText,
    sendRequest,
    generateImage,
    textToSpeech,
    listVoices,
    listEmotions,
    getLLMConfigs,
    editImage,
    getChatCompletion,
    lipSync,
    listLlms,
    getDefaultModels,
    getPersonality,
    getDefaultPersonality
}
