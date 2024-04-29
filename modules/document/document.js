const sendRequest = require("assistos").loadModule("util").sendRequest;
const documentType = "documents";
async function getDocumentsMetadata(spaceId){
    return await sendRequest(`/spaces/containerObject/meta/${spaceId}/${documentType}`, "GET");
}
async function getDocument(spaceId, documentId){
    return await sendRequest(`/spaces/containerObject/${spaceId}/${documentId}`, "GET");
}
async function addDocument(spaceId, documentData){
    documentData.metadata = ["id", "title"];
    return await sendRequest(`/spaces/containerObject/${spaceId}/${documentType}`, "POST", documentData);
}
async function updateDocument(spaceId, documentId, documentData){
    return await sendRequest(`/spaces/containerObject/${spaceId}/${documentId}`, "PUT", documentData);
}
async function deleteDocument(spaceId, documentId){
    return await sendRequest(`/spaces/containerObject/${spaceId}/${documentId}`, "DELETE");
}
async function updateDocumentTitle(spaceId, documentId, title) {
    let objectURI = encodeURIComponent(`${documentId}/title`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", title);
}
async function updateDocumentTopic(spaceId, documentId, topic) {
    let objectURI = encodeURIComponent(`${documentId}/topic`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", topic);
}
async function updateDocumentAbstract(spaceId, documentId, abstract) {
    let objectURI = encodeURIComponent(`${documentId}/abstract`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", abstract);
}

async function updateDocumentMainIdeas(spaceId, documentId, mainIdeas){
    //mainIdeas is an array of strings
    let objectURI = encodeURIComponent(`${documentId}/mainIdeas`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", mainIdeas);
}

async function updateAlternativeTitles(spaceId, documentId, alternativeTitles){
    //alternativeTitles is an array of strings
    let objectURI = encodeURIComponent(`${documentId}/alternativeTitles`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", alternativeTitles);
}
async function updateAlternativeAbstracts(spaceId, documentId, alternativeAbstracts){
    //alternativeAbstracts is an array of strings
    let objectURI = encodeURIComponent(`${documentId}/updateAlternativeAbstracts`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", alternativeAbstracts);
}

module.exports = {
    getDocumentsMetadata,
    getDocument,
    addDocument,
    updateDocument,
    deleteDocument,
    updateDocumentTitle,
    updateDocumentTopic,
    updateDocumentAbstract,
    updateDocumentMainIdeas,
    updateAlternativeTitles,
    updateAlternativeAbstracts
};