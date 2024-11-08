const Paragraph = require("./models/Paragraph");
async function getParagraph(spaceId, documentId, paragraphId) {
    let paragraphData = await this.sendRequest(`/documents/chapters/paragraphs/${spaceId}/${documentId}/${paragraphId}`, "GET");
    return new Paragraph(paragraphData);
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

async function swapParagraphs(spaceId, documentId, chapterId, paragraphId, paragraphId2, direction) {
    return await this.sendRequest(`/documents/chapters/paragraphs/swap/${spaceId}/${documentId}/${chapterId}/${paragraphId}/${paragraphId2}`, "PUT", { direction });
}
async function getParagraphText(spaceId, documentId, paragraphId) {
    return await this.sendRequest(`/documents/chapters/paragraphs/${spaceId}/${documentId}/${paragraphId}?fields=text`, "GET");
}
async function updateParagraphText(spaceId, documentId, paragraphId, text) {
    return await this.sendRequest(`/documents/chapters/paragraphs/${spaceId}/${documentId}/${paragraphId}?fields=text`, "PUT", text);
}
async function updateParagraphComment(spaceId, documentId, paragraphId, text) {
    return await this.sendRequest(`/documents/chapters/paragraphs/${spaceId}/${documentId}/${paragraphId}?fields=comment`, "PUT", text);
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
async function selectParagraph(spaceId, documentId, paragraphId, paragraphData) {
    return await this.sendRequest(`/documents/chapters/paragraphs/${spaceId}/${documentId}/${paragraphId}/select`, "PUT", paragraphData);
}
async function deselectParagraph(spaceId, documentId, paragraphId, selectId) {
    return await this.sendRequest(`/documents/chapters/paragraphs/${spaceId}/${documentId}/${paragraphId}/${selectId}/select`, "DELETE");
}
async function getSelectedParagraphs(spaceId, documentId) {
    return await this.sendRequest(`/documents/chapters/paragraphs/${spaceId}/${documentId}/select`, "GET");
}
module.exports = {
    getParagraph,
    addParagraph,
    updateParagraph,
    deleteParagraph,
    swapParagraphs,
    updateParagraphText,
    getParagraphText,
    updateParagraphAudio,
    updateImageParagraphDimensions,
    getParagraphAudio,
    generateParagraphAudio,
    updateImageParagraphLipSync,
    getImageParagraphLipSync,
    getParagraphCommands,
    updateParagraphCommands,
    generateParagraphLipSync,
    selectParagraph,
    deselectParagraph,
    getSelectedParagraphs,
    updateParagraphComment
}
