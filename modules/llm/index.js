const LLM = require("./models/LLM.js");
const {request} = require("../util");

async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}

async function generateText(data, spaceId) {
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/text/generate`, "POST", data)
}

/* {roles:["system","user","assistant/agent"], message:"String"} */

async function getChatCompletion(spaceId, chat) {
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/chat/generate`, "POST", chat)
}

async function generateImage(spaceId, modelConfigs) {
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/image/generate`, "POST", modelConfigs);
}

async function textToSpeech(spaceId, modelConfigs) {
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/audio/generate`, "POST", modelConfigs);
}

async function listVoices(spaceId) {
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/audio/listVoices`, "GET");
}
async function listEmotions(spaceId){
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/audio/listEmotions`, "GET");
}
async function getLLMConfigs(spaceId) {
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/configs`, "GET");
}
async function listLlms(spaceId) {
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms`, "GET");
}
async function editImage(spaceId, modelName, options) {
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/image/edit`, "POST", {
        modelName: modelName,
        ...options
    });
}
async function lipSync(spaceId,taskId, videoId, audioId, modelName, configs) {
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/video/lipsync`, "POST", {
        modelName: modelName,
        taskId: taskId,
        videoId: videoId,
        audioId: audioId,
        ...configs
    });
}

module.exports = {
    generateText,
    LLM,
    sendRequest,
    generateImage,
    textToSpeech,
    listVoices,
    listEmotions,
    getLLMConfigs,
    editImage,
    getChatCompletion,
    lipSync,
    listLlms
}
