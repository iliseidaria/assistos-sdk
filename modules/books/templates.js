const request = require("../util").request;

async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}

async function getTemplates(spaceId) {
    return await this.sendRequest(`/books-generator/templates/${spaceId}`, "GET");
}

async function getTemplate(spaceId, templateId) {
    return await this.sendRequest(`/books-generator/templates/${spaceId}/${templateId}`, "GET");
}

async function addTemplate(spaceId, data) {
    return await this.sendRequest(`/books-generator/templates/${spaceId}`, "POST", data);
}

async function updateTemplate(spaceId, templateId, data) {
    return await this.sendRequest(`/books-generator/templates/${spaceId}/${templateId}`, "PUT", data);
}

async function deleteTemplate(spaceId, templateId) {
    return await this.sendRequest(`/books-generator/templates/${spaceId}/${templateId}`, "DELETE");
}

module.exports = {
    sendRequest,
    getTemplates,
    getTemplate,
    addTemplate,
    updateTemplate,
    deleteTemplate
}
