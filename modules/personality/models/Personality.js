const {request} = require("../../util");

class Personality {
    constructor(personalityData) {
        this.name = personalityData.name;
        this.description = personalityData.description;
        this.id = personalityData.id
        this.imageId = personalityData.imageId;
        this.metadata = personalityData.metadata;
        /* TODO: TBD */
        this.voiceId = personalityData.voiceId;
        this.llms = personalityData.llms || {};
    }
    async sendRequest(url, method, data) {
        return await request(url, method, this.__securityContext, data);
    }
    getCurrentModel(modelType) {
        if (!this.llms[modelType]) {
            throw new Error(`Invalid model Type ${modelType}!, available LLM Model types are : ${Object.keys(this.llms).join(", ")}`);
        }
        return this.llms[modelType]
    }

    async generateText(spaceId, prompt) {
        const requestData = {
            modelName: this.getCurrentModel("text"),
            prompt: prompt
        }
        const response = await this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/text/generate`, "POST", requestData)
        return response;
    }

    //We can inject Personality Description as system prompt here
    async getChatCompletion(spaceId, chat, injectPersonalityAsSysPrompt) {
        const applyPersonalityToSysPromptChat = () => {
            const sysPrompt = {"role": "system", "content": this.description}
            chat = [sysPrompt,...chat]
        }
        if(injectPersonalityAsSysPrompt){
            applyPersonalityToSysPromptChat()
        }
        const requestData = {
            modelName: this.getCurrentModel("chat"),
            chat: chat
        }
        const response = await  this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/chat/generate`, "POST", requestData);
        return response;
    }

    async textToSpeech(spaceId, modelConfigs) {
        const requestData = {
            modelName: this.getCurrentModel("audio"),
            ...modelConfigs
        }
        const response = await  this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/audio/generate`, "POST", requestData);
        return response
    }

    async generateImage(spaceId, modelConfigs) {
        const requestData = {
            modelName: this.getCurrentModel("image"),
            ...modelConfigs
        }
        const response = await  this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/image/generate`, "POST", requestData);
        return response;
    }

    async editImage(spaceId, modelConfigs) {
        const requestData = {
            modelName: this.getCurrentModel("image"),
            ...modelConfigs
        }
        const response = await  this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/image/edit`, "POST", requestData);
        return response
    }

    async lipSync(spaceId, taskId, videoId, audioId, modelConfigs = {}) {
        const requestData = {
            modelName: this.getCurrentModel("video"),
            taskId: taskId,
            videoId: videoId,
            audioId: audioId,
            ...modelConfigs
        }
        const response = await  this.sendRequest(`/apis/v1/spaces/${spaceId}/llms/video/lipsync`, "POST", requestData);
        return response;
    }
}

module.exports = Personality;
