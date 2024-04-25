async function sendRequest(url, method, data){
    let result;
    let init = {
        method: method
    };
    if(method === "POST" || method === "PUT"){
        init.body = typeof data === "string" ? data : JSON.stringify(data);
        init.headers = {
            "Content-type": "application/json; charset=UTF-8"
        };
    }
    try {
        result = await fetch(url,init);
    } catch (err) {
        console.error(err);
    }
    return await result.text();
}
const documentType = "documents";
function getObjectId(objectType, objectId){
    return `${objectType}_${objectId}`;
}
async function getDocumentsMetadata(spaceId){
    return await sendRequest(`/spaces/containerObject/meta/${spaceId}/${documentType}`, "GET");
}
async function getDocument(spaceId, documentId){
    return await sendRequest(`/spaces/containerObject/${spaceId}/${getObjectId(documentType, documentId)}`, "GET");
}
async function addDocument(spaceId, documentData){
    return await sendRequest(`/spaces/containerObject/${spaceId}/${documentType}`, "POST", documentData);
}
async function updateDocument(spaceId, documentId, documentData){
    return await sendRequest(`/spaces/containerObject/${spaceId}/${getObjectId(documentType, documentId)}`, "PUT", documentData);
}
async function deleteDocument(spaceId, documentId){
    return await sendRequest(`/spaces/containerObject/${spaceId}/${getObjectId(documentType, documentId)}`, "DELETE");
}
async function updateDocumentTitle(spaceId, documentId, title) {
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/title`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", title);
}
async function updateDocumentTopic(spaceId, documentId, topic) {
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/topic`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", topic);
}
async function updateDocumentAbstract(spaceId, documentId, abstract) {
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/abstract`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", abstract);
}

async function updateDocumentMainIdeas(spaceId, documentId, mainIdeas){
    //mainIdeas is an array of strings
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/mainIdeas`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", mainIdeas);
}

async function updateAlternativeTitles(spaceId, documentId, alternativeTitles){
    //alternativeTitles is an array of strings
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/alternativeTitles`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", alternativeTitles);
}
async function updateAlternativeAbstracts(spaceId, documentId, alternativeAbstracts){
    //alternativeAbstracts is an array of strings
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/updateAlternativeAbstracts`);
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