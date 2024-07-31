const LLM = require("./models/LLM.js");
const {request, notificationService} = require("../util");
const constants = require("../../constants");

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
    const assistOS = require("assistos");
    let url = "/apis/v1/spaces/" + spaceId + "/llms/audio/generate";
    let headers={
        "content-type": "application/json",
    }
    if (assistOS.envType === constants.ENV_TYPE.NODE) {
        url = `${constants[constants.ENVIRONMENT_MODE]}${url}`;
        headers.Cookie = this.__securityContext.cookies;
    }
    let response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(modelConfigs)
    });

    if (!response.ok) {
        let error = await response.json();
        throw new Error(error.message);
    }
    if (assistOS.envType === constants.ENV_TYPE.NODE) {
        return await response.arrayBuffer();
    }
    return await response.blob();
}

async function listVoicesAndEmotions(spaceId) {
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/audio/listVoicesAndEmotions`, "GET");
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
module.exports = {
    sendLLMRequest,
    LLM,
    sendRequest,
    generateImage,
    textToSpeech,
    listVoicesAndEmotions,
    getLLMConfigs,
    editImage,
    sendLLMChatRequest
}