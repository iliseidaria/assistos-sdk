const { getAPIClient } = require("../util/utils");
const { CHAT_PLUGIN } = require("../../constants");

function withClient(fn) {
    return async function (spaceId, ...args) {
        const client = await getAPIClient("*", CHAT_PLUGIN, spaceId);
        return await fn.call(this, client, spaceId, ...args);
    };
}

module.exports = {
    getChat: withClient(function (client, spaceId, chatId) {
        return client.getChat(chatId);
    }),
    getChatMessages: withClient(function (client, spaceId, chatId) {
        return client.getChatMessages(chatId);
    }),
    getChatContext: withClient(function (client, spaceId, chatId) {
        return client.getChatContext(chatId);
    }),
    createChat: withClient(function (client, spaceId, personalityId) {
        return client.createChat(spaceId, personalityId);
    }),
    deleteChat: withClient(function (client, spaceId, chatId) {
        return client.deleteChat(chatId);
    }),
    resetChat: withClient(function (client, spaceId, chatId) {
        return client.resetChat(chatId);
    }),
    resetChatContext: withClient(function (client, spaceId, chatId) {
        return client.resetChatContext(chatId);
    }),
    resetChatMessages: withClient(function (client, spaceId, chatId) {
        return client.resetChatMessages(chatId);
    }),
    addPreferenceToContext: withClient(function (client, spaceId, chatId, preference) {
        return client.addPreferenceToContext(chatId, preference);
    }),
    deletePreferenceFromContext: withClient(function (client, spaceId, chatId, preference) {
        return client.deletePreferenceFromContext(chatId, preference);
    }),
    addMessageToContext: withClient(function (client, spaceId, chatId, messageId) {
        return client.addMessageToContext(chatId, messageId);
    }),
    removeMessageFromContext: withClient(function (client, spaceId, chatId, messageId) {
        return client.removeMessageFromContext(chatId, messageId);
    }),
    updateChatContextItem: withClient(function (client, spaceId, chatId, contextItemId, contextItem) {
        return client.updateChatContextItem(chatId, contextItemId, contextItem);
    }),
    addChatToAgent: withClient(function (client, spaceId, chatId, agentId) {
        return client.addChatToAgent(chatId, agentId);
    }),
    removeChatFromAgent: withClient(function (client, spaceId, chatId, agentId) {
        return client.removeChatFromAgent(chatId, agentId);
    }),
    sendMessage: withClient(function (client, spaceId, chatId, userId, message, role) {
        return client.sendMessage(chatId, userId, message, role);
    }),
    sendQuery: withClient(function (client, spaceId, chatId, personalityId, userId, prompt) {
        return client.sendQuery(chatId, personalityId, userId, prompt);
    }),
    sendQueryStreaming: withClient(function (client, spaceId, chatId, personalityId, userId, prompt) {
        return client.sendQueryStreaming(chatId, personalityId, userId, prompt);
    })
};
