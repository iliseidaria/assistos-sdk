const LLM = require("./models/LLM.js");
const {request} = require("../util");
async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}
async function sendLLMRequest(data){
    return await this.sendRequest(`apis/v1/spaces/${assistOS.space.id}/llms/text/generate`, "POST", data)
}
async function generateImage(spaceId, modelConfigs){
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/image/generate`, "POST", modelConfigs);
}
async function textToSpeech(spaceId, modelConfigs){
    let response =  await fetch(`/apis/v1/spaces/${spaceId}/llms/audio/generate`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify(modelConfigs)
    });
    if(!response.ok){
        let error = await response.json();
        throw new Error(error.message);
    }
    return await response.blob();
}
async function listVoicesAndEmotions(spaceId){
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/audio/listVoicesAndEmotions`, "GET");
}
async function getLLMConfigs(spaceId){
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/configs`, "GET");
}
async function editImage(spaceId, modelName, options){
    return await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/image/edit`, "POST", {
        modelName: modelName,
        ...options
    });
}

async function sendLLMChatRequest(data){
    return await this.sendRequest(`apis/v1/spaces/${assistOS.space.id}/llms/text/generate`, "POST", data)
}
async function getImageResult(){
    const eventSource = new EventSource('/webhook/image/event');

    eventSource.onmessage = function(event) {
        const data = JSON.parse(event.data);
        const imagesDiv = document.getElementById('images');
        const newImage = document.createElement('img');
        newImage.src = data.imageUrl;
        imagesDiv.appendChild(newImage);
        eventSource.close();
    };

    eventSource.onerror = function(err) {
        console.error('EventSource failed:', err);
    };
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