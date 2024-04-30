const sendRequest = require("assistos").loadModule("util").sendRequest;

async function getParagraph(spaceId, documentId, paragraphId){
    let objectURI = encodeURIComponent(`${documentId}/${paragraphId}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}
async function addParagraph(spaceId, documentId, chapterId, paragraphData){
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}/paragraphs`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "POST", paragraphData);
}
async function updateParagraph(spaceId, documentId, chapterId, paragraphId, paragraphData){
    let objectURI = encodeURIComponent(`${documentId}/${paragraphId}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", paragraphData);
}
async function deleteParagraph(spaceId, documentId, chapterId, paragraphId){
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}/${paragraphId}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "DELETE");
}

async function swapParagraphs(spaceId, documentId, chapterId, paragraphId, paragraphId2){
    let body = {
        item1: paragraphId,
        item2: paragraphId2
    }
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}/paragraphs`);
    return await sendRequest(`/spaces/embeddedObject/swap/${spaceId}/${objectURI}`, "PUT", body);
}
async function updateParagraphText(spaceId, documentId, paragraphId, text) {
    let objectURI = encodeURIComponent(`${documentId}/${paragraphId}/text`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", text);
}
async function updateParagraphMainIdea(spaceId, documentId, paragraphId, mainIdea) {
    let objectURI = encodeURIComponent(`${documentId}/${paragraphId}/mainIdea`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", mainIdea);
}

async function getAlternativeParagraph(spaceId, documentId, alternativeParagraphId){
    let objectURI = encodeURIComponent(`${documentId}/${alternativeParagraphId}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}
async function addAlternativeParagraph(spaceId, documentId, chapterId, paragraphId, alternativeParagraph){
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}/${paragraphId}/alternativeParagraphs`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "POST", alternativeParagraph);
}
async function updateAlternativeParagraph(spaceId, documentId, alternativeParagraphId, alternativeParagraph){
    let objectURI = encodeURIComponent(`${documentId}/${alternativeParagraph.id}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", alternativeParagraph);
}
async function deleteAlternativeParagraph(spaceId, documentId, chapterId, paragraphId, alternativeParagraphId){
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}/${paragraphId}/${alternativeParagraphId}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "DELETE");
}
module.exports = {
    getParagraph,
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