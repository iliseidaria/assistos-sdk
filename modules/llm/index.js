const LLM = require("./models/LLM.js");
const {request} = require("../util");

async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}

async function sendLLMRequest(data) {
    return await this.sendRequest(`apis/v1/spaces/${assistOS.space.id}/llms/text/generate`, "POST", data)
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

async function editImage(spaceId, modelName, options) {
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/image/edit`, "POST", {
        modelName: modelName,
        ...options
    });
}

async function sendLLMChatRequest(data) {
    return await this.sendRequest(`apis/v1/spaces/${assistOS.space.id}/llms/text/generate`, "POST", data)
}
async function lipSync(spaceId,documentId,paragraphId,imageSrc,audioSrc, modelName, configs) {
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/video/lipsync`, "POST", {
        modelName: modelName,
        documentId: documentId,
        paragraphId: paragraphId,
        imageSrc: imageSrc,
        audioSrc: audioSrc,
        ...configs
    });
}

module.exports = {
    sendLLMRequest,
    LLM,
    sendRequest,
    generateImage,
    textToSpeech,
    listVoices,
    listEmotions,
    getLLMConfigs,
    editImage,
    sendLLMChatRequest,
    lipSync
}
