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

async function updateParagraphText(spaceId, documentId, paragraphId, text) {
    return await this.sendRequest(`/documents/chapters/paragraphs/${spaceId}/${documentId}/${paragraphId}?fields=text`, "PUT", text);
}

// TODO remove
async function updateParagraphAudio(spaceId, documentId, paragraphId, audioURL) {
    return await this.sendRequest(`/documents/chapters/paragraphs/${spaceId}/${documentId}/${paragraphId}?fields=audio`, "PUT", audioURL);
}

async function updateParagraphCommands(spaceId, documentId, paragraphId, commandsObject) {
    return await this.sendRequest(`/documents/chapters/paragraphs/${spaceId}/${documentId}/${paragraphId}?fields=commands`, "PUT", commandsObject);
}

async function getParagraphCommands(spaceId, documentId, paragraphId) {
    return await this.sendRequest(`/documents/chapters/paragraphs/${spaceId}/${documentId}/${paragraphId}?fields=commands`, "GET");
}

async function getParagraphAudio(spaceId, documentId, paragraphId) {
    return await this.sendRequest(`/documents/chapters/paragraphs/${spaceId}/${documentId}/${paragraphId}?fields=audio`, "GET");
}

async function updateImageParagraphDimensions(spaceId, documentId, paragraphId, dimensions) {
    return await this.sendRequest(`/documents/chapters/paragraphs/${spaceId}/${documentId}/${paragraphId}?fields=dimensions`, "PUT", dimensions);
}

async function updateImageParagraphLipSync(spaceId, documentId, paragraphId, videoData) {
    return await this.sendRequest(`/documents/chapters/paragraphs/${spaceId}/${documentId}/${paragraphId}?fields=lipSync`, "PUT", videoData);
}

async function getImageParagraphLipSync(spaceId, documentId, paragraphId) {
    return await this.sendRequest(`documents/chapters/paragraphs/${spaceId}/${documentId}/${paragraphId}?fields=lipSync`, "GET");
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
    updateParagraphAudio,
    updateImageParagraphDimensions,
    getParagraphAudio,
    generateParagraphAudio,
    updateImageParagraphLipSync,
    getImageParagraphLipSync,
    getParagraphCommands,
    updateParagraphCommands,
    generateParagraphLipSync
}
