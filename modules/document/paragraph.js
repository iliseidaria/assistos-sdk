const Paragraph = require("./models/Paragraph");
const {getAPIClient} = require("../util/utils");
const constants = require("../../constants");
async function getParagraph(spaceId, paragraphId) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    let paragraph = await client.getParagraph(paragraphId);
    return new Paragraph(paragraph);
}

async function addParagraph(spaceId, chapterId, paragraphText, commands, comments, position) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.createParagraph(chapterId, paragraphText, commands, comments, position);
}

async function updateParagraph(spaceId, chapterId, paragraphId, paragraphText, commands, comments, additionalData) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.updateParagraph(chapterId, paragraphId, paragraphText, commands, comments, additionalData);
}

async function deleteParagraph(spaceId, chapterId, paragraphId) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.deleteParagraph(chapterId, paragraphId);
}
async function changeParagraphOrder(spaceId, chapterId, paragraphId, position) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.changeParagraphOrder(chapterId, paragraphId, position)
}

async function chatCompleteParagraph({ spaceId, documentId, paragraphId, prompt, modelName=undefined, agentId=undefined }) {
    if (spaceId === undefined) throw new Error("Parameter 'spaceId' is required")
    if (documentId === undefined) throw new Error("Parameter 'documentId' is required")
    if (paragraphId === undefined) throw new Error("Parameter 'paragraphId' is required")
    if (prompt === undefined) throw new Error("Parameter 'prompt' is required")
    if (modelName === undefined && agentId === undefined) throw new Error("Either 'modelName' or 'agentId' must be defined")
    return this.sendRequest(`/spaces/chat-completion/${spaceId}/${documentId}/${paragraphId}`, "POST", {
        modelName, prompt, agentId
    })
}

async function createTextToSpeechTask(spaceId, documentId, paragraphId) {
    return await this.sendRequest(`/tasks/audio/${spaceId}/${documentId}/${paragraphId}`, "POST", {});
}
async function createLipSyncTask(spaceId, documentId, paragraphId, modelName, configs) {
    return await this.sendRequest(`/tasks/lipsync/${spaceId}/${documentId}/${paragraphId}`, "POST", {
        modelName: modelName,
        ...(configs || {})
    });
}
async function createParagraphCompileVideoTask(spaceId, documentId, chapterId, paragraphId) {
    return await this.sendRequest(`/tasks/video/${spaceId}/${documentId}/${chapterId}/${paragraphId}`, "POST", {});
}
module.exports = {
    getParagraph,
    addParagraph,
    updateParagraph,
    deleteParagraph,
    changeParagraphOrder,
    createTextToSpeechTask,
    createLipSyncTask,
    createParagraphCompileVideoTask,
    chatCompleteParagraph
}
