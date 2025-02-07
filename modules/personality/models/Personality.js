class Personality {
    constructor(personalityData) {
        this.name = personalityData.name;
        this.description = personalityData.description;
        this.id = personalityData.id
        this.imageId = personalityData.imageId;
        this.metadata = personalityData.metadata;
        this.chatPrompt = personalityData.chatPrompt;
        this.chats=personalityData.chats;
        this.voiceId = personalityData.voiceId;
        this.llms = personalityData.llms || {};
    }

    applyPersonalityToSysPromptChat(chat) {
        const sysPrompt = {"role": "system", "content": this.description}
        chat = [sysPrompt, ...chat]
        return chat
    }

    getCurrentSettings(interfaceName) {
        if (!this.llms[interfaceName]) {
            throw new Error(`Invalid interface Name: ${interfaceName}!, available interfaces: ${Object.keys(this.llms).join(", ")}`);
        }
        return this.llms[interfaceName]
    }
}

module.exports = Personality;
