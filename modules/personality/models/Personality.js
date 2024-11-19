const flowModule = require('assistos').loadModule('flow', {});
const llmModule = require('assistos').loadModule('llm', {});

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

    async callFlow(flowName, context) {
        await flowModule.callFlow(assistOS.space.id, flowName, context, this.id);
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
        const response = await llmModule.generateText(requestData, spaceId);
        return response;
    }

    async getChatCompletion(spaceId, chat) {
        const requestData = {
            modelName: this.getCurrentModel("chat"),
            chat: chat
        }
        const response = await llmModule.getChatCompletion(requestData, spaceId);
        return response;
    }


    async textToSpeech(spaceId, modelConfigs) {
        return await llmModule.textToSpeech(assistOS.space.id, modelConfigs);
    }

    async generateImage(spaceId, modelConfigs) {
        return await llmModule.generateImage(assistOS.space.id, modelConfigs);
    }

    async editImage(spaceId, options) {
        return await llmModule.editImage(assistOS.space.id, modelName, options);
    }

    async lipSync(spaceId,taskId, videoId, audioId, configs) {
        const requestData = {
            modelName: this.getCurrentModel("video"),
            taskId: taskId,
            videoId: videoId,
            audioId: audioId,
            ...configs
        }
    }
}

module.exports = Personality;
