const { getAPIClient } = require("../util/utils");
const { WEB_ASSISTANT_PLUGIN } = require("../../constants");

function withClient(fn) {
    return async function (spaceId, ...args) {
        const client = await getAPIClient("*", WEB_ASSISTANT_PLUGIN, spaceId);
        return await fn.call(this, client, spaceId, ...args);
    };
}

module.exports = {
    getWebChatThemes: withClient(function (client, spaceId) {
        return client.getWebChatThemes();
    }),

    getWebChatTheme: withClient(function (client, spaceId, themeId) {
        return client.getWebChatTheme(themeId);
    }),

    addWebChatTheme: withClient(function (client, spaceId, theme) {
        return client.addWebChatTheme(theme);
    }),

    updateWebChatTheme: withClient(function (client, spaceId, themeId, theme) {
        return client.updateWebChatTheme(themeId, theme);
    }),

    deleteWebAssistantTheme: withClient(function (client, spaceId, themeId) {
        return client.deleteWebAssistantTheme(themeId);
    }),

    getWebChatConfiguration: withClient(function (client, spaceId) {
        return client.getWebChatConfiguration();
    }),

    updateWebChatConfiguration: withClient(function (client, spaceId, settings) {
        return client.updateWebChatConfiguration(settings);
    }),

    addWebAssistantConfigurationPage: withClient(function (client, spaceId, page) {
        return client.addWebAssistantConfigurationPage(page);
    }),

    getWebAssistantConfigurationPages: withClient(function (client, spaceId) {
        return client.getWebAssistantConfigurationPages();
    }),

    getWebAssistantConfigurationPage: withClient(function (client, spaceId, pageId) {
        return client.getWebAssistantConfigurationPage(pageId);
    }),

    updateWebAssistantConfigurationPage: withClient(function (client, spaceId, pageId, page) {
        return client.updateWebAssistantConfigurationPage(pageId, page);
    }),

    deleteWebAssistantConfigurationPage: withClient(function (client, spaceId, pageId) {
        return client.deleteWebAssistantConfigurationPage(pageId);
    }),

    getWebAssistantHomePage: withClient(function (client, spaceId) {
        return client.getWebAssistantHomePage();
    }),

    getWebAssistantConfigurationPageMenuItem: withClient(function (client, spaceId, menuItemId) {
        return client.getWebAssistantConfigurationPageMenuItem(menuItemId);
    }),

    getWebAssistantConfigurationPageMenu: withClient(function (client, spaceId) {
        return client.getWebAssistantConfigurationPageMenu();
    }),

    addWebAssistantConfigurationPageMenuItem: withClient(function (client, spaceId, pageId, menuItem) {
        return client.addWebAssistantConfigurationPageMenuItem(pageId, menuItem);
    }),

    updateWebAssistantConfigurationPageMenuItem: withClient(function (client, spaceId, pageId, menuItemId, menuItem) {
        return client.updateWebAssistantConfigurationPageMenuItem(pageId, menuItemId, menuItem);
    }),

    deleteWebAssistantConfigurationPageMenuItem: withClient(function (client, spaceId, pageId, menuItemId) {
        return client.deleteWebAssistantConfigurationPageMenuItem(pageId, menuItemId);
    }),

    getWidget: withClient(function (client, spaceId, applicationId, widgetName) {
        return client.getWidget(applicationId, widgetName);
    })
};
