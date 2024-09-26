async function getParagraph(spaceId, documentId, paragraphId) {
    return await this.sendRequest(`/documents/chapters/paragraphs/${spaceId}/${documentId}/${paragraphId}`, "GET");
}

async function addParagraph(spaceId, documentId, chapterId, paragraphData) {
    return await this.sendRequest(`/documents/chapters/paragraphs/${spaceId}/${documentId}/${chapterId}`, "POST", paragraphData);
}

async function updateParagraph(spaceId, documentId, paragraphId, paragraphData) {
    return await this.sendRequest(`/documents/chapters/paragraphs/${spaceId}/${documentId}/${paragraphId}`, "PUT", paragraphData);
}

async function deleteParagraph(spaceId, documentId, chapterId, paragraphId) {
    return await this.sendRequest(`/documents/chapters/paragraphs/${spaceId}/${documentId}/${chapterId}/${paragraphId}`, "DELETE");
}

async function swapParagraphs(spaceId, documentId, chapterId, paragraphId, paragraphId2) {
    let body = {
        item1: paragraphId,
        item2: paragraphId2
    }
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}/paragraphs`);
    return await this.sendRequest(`/spaces/embeddedObject/swap/${spaceId}/${objectURI}`, "PUT", body);
}

async function insertParagraph(spaceId, documentId, chapterId, predecessorParagraphId, paragraphData) {
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}/paragraphs/${predecessorParagraphId}`);
    return await this.sendRequest(`/spaces/embeddedObject/insert/${spaceId}/${objectURI}`, "POST", paragraphData);
}

async function updateParagraphText(spaceId, documentId, paragraphId, text) {
    let objectURI = encodeURIComponent(`${documentId}/${paragraphId}/text`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", text);
}


async function updateParagraphMainIdea(spaceId, documentId, paragraphId, mainIdea) {
    let objectURI = encodeURIComponent(`${documentId}/${paragraphId}/mainIdea`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", mainIdea);
}

async function getAlternativeParagraph(spaceId, documentId, alternativeParagraphId) {
    let objectURI = encodeURIComponent(`${documentId}/${alternativeParagraphId}`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}

async function addAlternativeParagraph(spaceId, documentId, chapterId, paragraphId, alternativeParagraph) {
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}/${paragraphId}/alternativeParagraphs`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "POST", alternativeParagraph);
}

async function updateAlternativeParagraph(spaceId, documentId, alternativeParagraphId, alternativeParagraph) {
    let objectURI = encodeURIComponent(`${documentId}/${alternativeParagraph.id}`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", alternativeParagraph);
}

async function deleteAlternativeParagraph(spaceId, documentId, chapterId, paragraphId, alternativeParagraphId) {
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}/${paragraphId}/${alternativeParagraphId}`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "DELETE");
}

// TODO remove
async function updateParagraphAudio(spaceId, documentId, paragraphId, audioURL) {
    let objectURI = encodeURIComponent(`${documentId}/${paragraphId}/audio`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", audioURL);
}

async function updateParagraphCommands(spaceId, documentId, paragraphId, commandsObject) {
    let objectURI = encodeURIComponent(`${documentId}/${paragraphId}/commands`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", commandsObject);
}

async function getParagraphCommands(spaceId, documentId, paragraphId) {
    let objectURI = encodeURIComponent(`${documentId}/${paragraphId}/commands`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}

async function getParagraphAudio(spaceId, documentId, paragraphId) {
    let objectURI = encodeURIComponent(`${documentId}/${paragraphId}/audio`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}

async function updateImageParagraphDimensions(spaceId, documentId, paragraphId, dimensions) {
    let objectURI = encodeURIComponent(`${documentId}/${paragraphId}/dimensions`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", dimensions);
}

async function updateImageParagraphLipSync(spaceId, documentId, paragraphId, videoData) {
    let objectURI = encodeURIComponent(`${documentId}/${paragraphId}/lipSync`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", videoData);
}

async function getImageParagraphLipSync(spaceId, documentId, paragraphId) {
    let objectURI = encodeURIComponent(`${documentId}/${paragraphId}/lipSync`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}

async function generateParagraphAudio(spaceId, documentId, paragraphId) {
    return await this.sendRequest(`/tasks/audio/${spaceId}/${documentId}/${paragraphId}`, "POST", {});
}

async function generateParagraphLipSync(spaceId, documentId, paragraphId, modelName, configs) {
    return await this.sendRequest(`/tasks/lipsync/${spaceId}/${documentId}/${paragraphId}`, "POST", {
        modelName: modelName,
        ...(configs || {})
    });
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
    deleteAlternativeParagraph,
    updateParagraphAudio,
    updateImageParagraphDimensions,
    getParagraphAudio,
    generateParagraphAudio,
    updateImageParagraphLipSync,
    getImageParagraphLipSync,
    getParagraphCommands,
    updateParagraphCommands,
    insertParagraph,
    generateParagraphLipSync
}
