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
const chapterType = "chapters";
const paragraphType = "paragraphs";
function getObjectId(objectType, objectId){
    return `${objectType}_${objectId}`;
}
async function getParagraph(spaceId, documentId, paragraphId){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(paragraphType, paragraphId)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}
async function addParagraph(spaceId, documentId, chapterId, paragraphData){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}/${paragraphType}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "POST", paragraphData);
}
async function updateParagraph(spaceId, documentId, chapterId, paragraphId, paragraphData){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(paragraphType, paragraphId)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", paragraphData);
}
async function deleteParagraph(spaceId, documentId, chapterId, paragraphId){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}/${getObjectId(paragraphType, paragraphId)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT");
}

async function swapParagraphs(spaceId, documentId, paragraphId, paragraphId2){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(paragraphType, paragraphId)}/position`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", paragraphId2);
}
async function updateParagraphText(spaceId, documentId, paragraphId, text) {
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(paragraphType, paragraphId)}/text`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", text);
}
async function updateParagraphMainIdea(spaceId, documentId, paragraphId, mainIdea) {
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(paragraphType, paragraphId)}/mainIdea`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", mainIdea);
}

async function getAlternativeParagraph(spaceId, documentId, alternativeParagraphId){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId("alternativeParagraphs", alternativeParagraphId)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}
async function addAlternativeParagraph(spaceId, documentId, chapterId, paragraphId, alternativeParagraph){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}/${getObjectId(paragraphType, paragraphId)}/alternativeParagraphs`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "POST", alternativeParagraph);
}
async function updateAlternativeParagraph(spaceId, documentId, alternativeParagraphId, alternativeParagraph){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId("alternativeParagraphs", alternativeParagraph.id)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", alternativeParagraph);
}
async function deleteAlternativeParagraph(spaceId, documentId, chapterId, paragraphId, alternativeParagraphId){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}/${getObjectId(paragraphType, paragraphId)}/${getObjectId("alternativeParagraphs", alternativeParagraphId)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "DELETE");
}
module.exports = {
    addParagraph,
    updateParagraph,
    deleteParagraph,
    swapParagraphs,
    updateParagraphText,
    updateParagraphMainIdea,
    addAlternativeParagraph,
    updateAlternativeParagraph,
    deleteAlternativeParagraph
}