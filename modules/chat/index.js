const {getAPIClient} = require("../util/utils");
const constants = require("../../constants");

async function getChat(spaceId, chatId) {
    let client = await getAPIClient("*", constants.CHAT_PLUGIN, spaceId);
    return await client.getChat(chatId);
}
async function getChatMessages(spaceId, chatId) {
    let client = await getAPIClient("*", constants. CHAT_PLUGIN, spaceId);
    return await client.getChatMessages(chatId);
}
async function getChatContext(spaceId, chatId) {
    let client = await getAPIClient("*", constants. CHAT_PLUGIN, spaceId);
    return await client.getChatContext(chatId);
}
async function createChat(spaceId, personalityId) {
    let client = await getAPIClient("*", constants. CHAT_PLUGIN, spaceId);
    return await client.createChat(spaceId, personalityId);
}
async function deleteChat(spaceId, chatId) {
    let client = await getAPIClient("*", constants. CHAT_PLUGIN, spaceId);
    return await client.deleteChat(chatId);
}
async function resetChat(spaceId, chatId) {
    let client = await getAPIClient("*", constants. CHAT_PLUGIN, spaceId);
    return await client.resetChat(chatId);
}
async function resetChatContext(spaceId, chatId) {
    let client = await getAPIClient("*", constants. CHAT_PLUGIN, spaceId);
    return await client.resetChatContext(chatId);
}
async function resetChatMessages(spaceId, chatId) {
    let client = await getAPIClient("*", constants. CHAT_PLUGIN, spaceId);
    return await client.resetChatMessages(chatId);
}
async function addPreferenceToContext(spaceId, chatId, preference) {
    let client = await getAPIClient("*", constants. CHAT_PLUGIN, spaceId);
    return await client.addPreferenceToContext(chatId, preference);
}
async function deletePreferenceFromContext(spaceId, chatId, preference) {
    let client = await getAPIClient("*", constants. CHAT_PLUGIN, spaceId);
    return await client.deletePreferenceFromContext(chatId, preference);
}
async function addMessageToContext(spaceId, chatId, messageId) {
    let client = await getAPIClient("*", constants. CHAT_PLUGIN, spaceId);
    return await client.addMessageToContext(chatId, messageId);
}
async function removeMessageFromContext(spaceId, chatId, messageId) {
    let client = await getAPIClient("*", constants. CHAT_PLUGIN, spaceId);
    return await client.removeMessageFromContext(chatId, messageId);
}
async function updateChatContextItem(spaceId, chatId, contextItemId, contextItem) {
    let client = await getAPIClient("*", constants. CHAT_PLUGIN, spaceId);
    return await client.updateChatContextItem(chatId, contextItemId, contextItem);
}
async function addChatToAgent(spaceId, chatId, agentId) {
    let client = await getAPIClient("*", constants. CHAT_PLUGIN, spaceId);
    return await client.addChatToAgent(chatId, agentId);
}
async function removeChatFromAgent(spaceId, chatId, agentId) {
    let client = await getAPIClient("*", constants. CHAT_PLUGIN, spaceId);
    return await client.removeChatFromAgent(chatId, agentId);
}
async function sendMessage(spaceId,chatId,userId,message,role){
    let client = await getAPIClient("*", constants. CHAT_PLUGIN, spaceId);
    return await client.sendMessage(chatId,userId,message,role);
}
async function sendQuery(spaceId,chatId,personalityId,userId,prompt){
    let client = await getAPIClient("*", constants. CHAT_PLUGIN, spaceId);
    return await client.sendQuery(chatId, personalityId,userId,prompt);
}
async function sendQueryStreaming(spaceId,chatId, personalityId, userId, prompt) {
    let client = await getAPIClient("*", constants. CHAT_PLUGIN, spaceId);
    return await client.sendQueryStreaming(chatId, personalityId,userId,prompt);
}

module.exports = {
    getChat,
    getChatMessages,
    getChatContext,
    createChat,
    deleteChat,
    resetChat,
    resetChatContext,
    resetChatMessages,
    addPreferenceToContext,
    deletePreferenceFromContext,
    addMessageToContext,
    removeMessageFromContext,
    updateChatContextItem,
    addChatToAgent,
    removeChatFromAgent,
    sendMessage,
    sendQuery,
    sendQueryStreaming
}
