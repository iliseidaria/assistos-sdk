const request = require("../util").request;
async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}
const Document = require("./models/Document");

async function exportDocument(spaceId, documentId, exportType){
    return await this.sendRequest(`/documents/export/${spaceId}/${documentId}`, "POST", {exportType});
}
async function importDocument(spaceId,documentFormData){
    return await this.sendRequest(`/documents/import/${spaceId}`, "POST", documentFormData);
}
async function getDocument(spaceId, documentId){
    let documentData = await this.sendRequest(`/documents/${spaceId}/${documentId}`, "GET");
    return new Document(documentData);
}
async function getDocumentsMetadata(spaceId){
    return await this.sendRequest(`/documents/metadata/${spaceId}`, "GET");
}
async function addDocument(spaceId, documentData){
    documentData.metadata = ["id", "title"];
    return await this.sendRequest(`/documents/${spaceId}`, "POST", documentData);
}
async function updateDocument(spaceId, documentId, documentData){
    return await this.sendRequest(`/documents/${spaceId}/${documentId}`, "PUT", documentData);
}
async function deleteDocument(spaceId, documentId){
    return await this.sendRequest(`/documents/${spaceId}/${documentId}`, "DELETE");
}
async function updateDocumentTitle(spaceId, documentId, title) {
    return await this.sendRequest(`/documents/${spaceId}/${documentId}?fields=title`, "PUT", title);
}
async function updateDocumentComment(spaceId, documentId, comment) {
    return await this.sendRequest(`/documents/${spaceId}/${documentId}?fields=comment`, "PUT", comment);
}

async function updateVideo(spaceId, documentId, videoPath){
    return await this.sendRequest(`/documents/${spaceId}/${documentId}?fields=video`, "PUT", videoPath);
}
async function updateDocumentTopic(spaceId, documentId, topic) {
    return await this.sendRequest(`/documents/${spaceId}/${documentId}?fields=topic`, "PUT", topic);
}
async function updateDocumentAbstract(spaceId, documentId, abstract) {
    return await this.sendRequest(`/documents/${spaceId}/${documentId}?fields=abstract`, "PUT", abstract);
}

async function getDocumentTopic(spaceId, documentId){
    return await this.sendRequest(`documents/${spaceId}/${documentId}?fields=topic`, "GET");
}
async function getDocumentAbstract(spaceId, documentId){
    return await this.sendRequest(`/documents/${spaceId}/${documentId}?fields=abstract`, "GET");
}
async function getDocumentTitle(spaceId, documentId){
    return await this.sendRequest(`documents/${spaceId}/${documentId}?fields=title`, "GET");
}
async function estimateDocumentVideoLength(spaceId, documentId){
    return await this.sendRequest(`/documents/video/estimate/${spaceId}/${documentId}`, "GET");
}
async function documentToVideo(spaceId, documentId){
    return await this.sendRequest(`/tasks/video/${spaceId}/${documentId}`, "POST", {});
}
async function getDocumentTasks(spaceId, documentId){
    return await this.sendRequest(`/tasks/${spaceId}/${documentId}`, "GET");
}
module.exports = {
    getDocumentTopic,
    getDocumentTitle,
    getDocumentAbstract,
    getDocumentsMetadata,
    getDocument,
    addDocument,
    updateDocument,
    deleteDocument,
    updateDocumentTitle,
    updateDocumentTopic,
    updateDocumentAbstract,
    sendRequest,
    documentToVideo,
    updateVideo,
    estimateDocumentVideoLength,
    getDocumentTasks,
    exportDocument,
    importDocument,
    updateDocumentComment
};
