const {request} = require("../util");
const Agent = require('./models/Agent.js');
const {getAPIClient} = require("../util/utils");
const constants = require("../../constants");
async function sendRequest(url, method, data, headers, externalRequest) {
    return await request(url, method, data, this.__securityContext, headers, externalRequest);
}
async function getAgents(spaceId){
    let client = await getAPIClient("*", constants.AGENT_PLUGIN, spaceId);
    let agents = await client.getAllAgentObjects();
    return agents.map(agent => new Agent(agent));
}

async function getAgent(spaceId, agentId){
    let client = await getAPIClient("*", constants.AGENT_PLUGIN, spaceId);
    let agent = await client.getAgent(agentId);
    return new Agent(agent);
}
async function getDefaultAgent(spaceId){
    let client = await getAPIClient("*", constants.SPACE_INSTANCE_PLUGIN, spaceId);
    let agentId = await client.getDefaultAgentId(spaceId);
    let agent = await getAgent(spaceId, agentId);
    return new Agent(agent);
}

async function createNewConversation(spaceId,personalityId){
    return await this.sendRequest(`/personalities/chats/${spaceId}/${personalityId}`,"POST");
}

async function getPersonalitiesConversations(spaceId,personalityId){
    return await this.sendRequest(`/personalities/chats/${spaceId}/${personalityId}`,"GET")
}

async function addAgent(spaceId, personalityData){
    let client = await getAPIClient("*", constants.AGENT_PLUGIN, spaceId);
    let chatClient = await getAPIClient("*", constants.CHAT_PLUGIN, spaceId);
    let agent = await client.createAgent(personalityData.name, personalityData.description);
    let chatId = await chatClient.createChat(agent.id);
    await chatClient.addChatToAgent(agent.id, chatId);
    return new Agent(agent);
}

async function updateAgent(spaceId, agentId, personalityData){
    let client = await getAPIClient("*", constants.AGENT_PLUGIN, spaceId);
    return await client.updateAgent(agentId, personalityData);
}
async function deleteAgent(spaceId, agentId){
    let client = await getAPIClient("*", constants.AGENT_PLUGIN, spaceId);
    return await client.deleteAgent(spaceId, agentId);
}

async function exportPersonality(spaceId, personalityId){
    return await this.sendRequest(`/spaces/${spaceId}/export/personalities/${personalityId}`, "GET");
}

async function sendQuery(spaceId, personalityId, chatId, prompt){
    return await this.sendRequest(`/chats/send/${spaceId}/${personalityId}/${chatId}`, "POST", prompt);
}
async function createChat(spaceId, personalityId){
    return await this.sendRequest(`/chats/${spaceId}/${personalityId}`, "POST");
}
module.exports = {
    addAgent,
    updateAgent,
    deleteAgent,
    sendRequest,
    getAgent,
    getAgents,
    getPersonalitiesConversations,
    exportPersonality,
    createChat,
    getDefaultAgent,
    Agent
}
