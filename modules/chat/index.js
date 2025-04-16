const { getAPIClient } = require("../util/utils");
const { CHAT_PLUGIN } = require("../../constants");

async function getChat(spaceId, chatId) {
    const client = await getAPIClient("*", CHAT_PLUGIN, spaceId);
    return await client.getChat(chatId);
}

async function getChatMessages(spaceId, chatId) {
    const client = await getAPIClient("*", CHAT_PLUGIN, spaceId);
    return await client.getChatMessages(chatId);
}

async function getChatContext(spaceId, chatId) {
    const client = await getAPIClient("*", CHAT_PLUGIN, spaceId);
    return await client.getChatContext(chatId);
}

async function createChat(spaceId, personalityId) {
    const client = await getAPIClient("*", CHAT_PLUGIN, spaceId);
    return await client.createChat(personalityId);
}

async function deleteChat(spaceId, chatId) {
    const client = await getAPIClient("*", CHAT_PLUGIN, spaceId);
    return await client.deleteChat(chatId);
}

async function resetChat(spaceId, chatId) {
    const client = await getAPIClient("*", CHAT_PLUGIN, spaceId);
    return await client.resetChat(chatId);
}

async function resetChatContext(spaceId, chatId) {
    const client = await getAPIClient("*", CHAT_PLUGIN, spaceId);
    return await client.resetChatContext(chatId);
}

async function resetChatMessages(spaceId, chatId) {
    const client = await getAPIClient("*", CHAT_PLUGIN, spaceId);
    return await client.resetChatMessages(chatId);
}

async function addPreferenceToContext(spaceId, chatId, preference) {
    const client = await getAPIClient("*", CHAT_PLUGIN, spaceId);
    return await client.addPreferenceToContext(chatId, preference);
}

async function deletePreferenceFromContext(spaceId, chatId, preference) {
    const client = await getAPIClient("*", CHAT_PLUGIN, spaceId);
    return await client.deletePreferenceFromContext(chatId, preference);
}

async function addMessageToContext(spaceId, chatId, messageId) {
    const client = await getAPIClient("*", CHAT_PLUGIN, spaceId);
    return await client.addMessageToContext(chatId, messageId);
}

async function removeMessageFromContext(spaceId, chatId, messageId) {
    const client = await getAPIClient("*", CHAT_PLUGIN, spaceId);
    return await client.removeMessageFromContext(chatId, messageId);
}

async function updateChatContextItem(spaceId, chatId, contextItemId, contextItem) {
    const client = await getAPIClient("*", CHAT_PLUGIN, spaceId);
    return await client.updateChatContextItem(chatId, contextItemId, contextItem);
}


async function sendMessage(spaceId, chatId, userId, message, role) {
    const client = await getAPIClient("*", CHAT_PLUGIN, spaceId);
    return await client.sendMessage(chatId, userId, message, role);
}

async function sendQuery(spaceId, chatId, personalityId, userId, prompt) {
    const client = await getAPIClient("*", CHAT_PLUGIN, spaceId);
    return await client.sendQuery(chatId, personalityId, userId, prompt);
}

async function sendQueryStreaming(spaceId, chatId, personalityId, userId, prompt) {
    const client = await getAPIClient("*", CHAT_PLUGIN, spaceId);
    return await client.sendQueryStreaming(chatId, personalityId, userId, prompt);
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
    sendMessage,
    sendQuery,
    sendQueryStreaming
};
