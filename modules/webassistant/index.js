const {getAPIClient} = require("../util/utils");
const constants = require("../../constants");
const PLUGIN = constants.WEB_ASSISTANT_PLUGIN;

async function getClient(spaceId){
    return await getAPIClient(this.__securityContext.userId, PLUGIN, spaceId, {
        email: this.__securityContext.email
    })
}


const updateWebAssistantConfigurationSettings = async function(spaceId, settings) {
    const client = await this.getClient(spaceId);
    return client.updateWebAssistantConfigurationSettings(settings);
}


const getWebAssistantThemes = async function (spaceId) {
    const client = await this.getClient(spaceId);
    return client.getWebChatThemes();
};
const getWebChatTheme = async function (spaceId, themeId) {
    const client = await this.getClient(spaceId);
    return client.getWebChatTheme(themeId);
};
const addWebChatTheme = async function (spaceId, theme) {
    const client = await this.getClient(spaceId);
    return client.addWebChatTheme(theme);
};
const updateWebChatTheme = async function (spaceId, themeId, theme) {
    const client = await this.getClient(spaceId);
    return client.updateWebChatTheme(themeId, theme);
};
const deleteWebAssistantTheme = async function (spaceId, themeId) {
    const client = await this.getClient(spaceId);
    return client.deleteWebAssistantTheme(themeId);
};

const getWebChatConfiguration = async function (spaceId) {
    const client = await this.getClient(spaceId);
    return client.getWebChatConfiguration();
};
const updateWebChatConfiguration = async function (spaceId, settings) {
    const client = await this.getClient(spaceId);
    return client.updateWebChatConfiguration(settings);
};
const addWebAssistantConfigurationPage = async function (spaceId, page) {
    const client = await this.getClient(spaceId);
    return client.addWebAssistantConfigurationPage(page);
};
const getWebAssistantConfiguration = async function (spaceId) {
    const client = await this.getClient(spaceId);
    return client.getWebAssistantConfiguration();
}
const getWebAssistantConfigurationPages = async function (spaceId) {
    const client = await this.getClient(spaceId);
    return client.getWebAssistantConfigurationPages();
};
const getWebAssistantConfigurationPage = async function (spaceId, pageId) {
    const client = await this.getClient(spaceId);
    return client.getWebAssistantConfigurationPage(pageId);
};
const updateWebAssistantConfigurationPage = async function (spaceId, pageId, page) {
    const client = await this.getClient(spaceId);
    return client.updateWebAssistantConfigurationPage(pageId, page);
};
const deleteWebAssistantConfigurationPage = async function (spaceId, pageId) {
    const client = await this.getClient(spaceId);
    return client.deleteWebAssistantConfigurationPage(pageId);
};
const getWebAssistantHomePage = async function (spaceId) {
    const client = await this.getClient(spaceId);
    return client.getWebAssistantHomePage();
};

const getWebAssistantConfigurationPageMenuItem = async function (spaceId, menuItemId) {
    const client = await this.getClient(spaceId);
    return client.getWebAssistantConfigurationPageMenuItem(menuItemId);
};
const getWebAssistantConfigurationPageMenu = async function (spaceId) {
    const client = await this.getClient(spaceId);
    return client.getWebAssistantConfigurationPageMenu();
};
const addWebAssistantConfigurationPageMenuItem = async function (spaceId, pageId, menuItem) {
    const client = await this.getClient(spaceId);
    return client.addWebAssistantConfigurationPageMenuItem(pageId, menuItem);
};
const updateWebAssistantConfigurationPageMenuItem = async function (spaceId, pageId, menuItemId, menuItem) {
    const client = await this.getClient(spaceId);
    return client.updateWebAssistantConfigurationPageMenuItem(pageId, menuItemId, menuItem);
};
const deleteWebAssistantConfigurationPageMenuItem = async function (spaceId, pageId, menuItemId) {
    const client = await this.getClient(spaceId);
    return client.deleteWebAssistantConfigurationPageMenuItem(pageId, menuItemId);
};

const getWidget = async function (spaceId, applicationId, widgetName) {
    const client = await this.getClient(spaceId);
    return client.getWidget(applicationId, widgetName);
};

module.exports = {
    getWebAssistantThemes,
    updateWebAssistantConfigurationSettings,
    getWebChatTheme,
    addWebChatTheme,
    updateWebChatTheme,
    deleteWebAssistantTheme,
    getWebChatConfiguration,
    updateWebChatConfiguration,
    addWebAssistantConfigurationPage,
    getWebAssistantConfigurationPages,
    getWebAssistantConfigurationPage,
    updateWebAssistantConfigurationPage,
    deleteWebAssistantConfigurationPage,
    getWebAssistantHomePage,
    getWebAssistantConfiguration,
    getWebAssistantConfigurationPageMenuItem,
    getWebAssistantConfigurationPageMenu,
    addWebAssistantConfigurationPageMenuItem,
    updateWebAssistantConfigurationPageMenuItem,
    deleteWebAssistantConfigurationPageMenuItem,
    getWidget,
    getClient
};
