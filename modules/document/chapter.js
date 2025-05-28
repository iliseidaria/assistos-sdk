const {getAPIClient} = require("../util/utils");
const constants = require("../../constants");
async function getClient(pluginName, spaceId) {
    return await getAPIClient(this.__securityContext.userId, pluginName, spaceId, {
        email: this.__securityContext.email
    })
}
async function getChapter(spaceId, documentId, chapterId) {
    let client = await this.getClient(constants.DOCUMENTS_PLUGIN, spaceId);
    return await client.getChapter(documentId, chapterId);
}

async function addChapter(spaceId, documentId, chapterTitle, commands, comments, position) {
    let client = await this.getClient(constants.DOCUMENTS_PLUGIN, spaceId);
    return await client.createChapter(documentId, chapterTitle, commands, comments, position);
}

async function updateChapter(spaceId, chapterId, chapterTitle, commands, comments, additionalData) {
    let client = await this.getClient(constants.DOCUMENTS_PLUGIN, spaceId);
    return await client.updateChapter(chapterId, chapterTitle, comments, commands, additionalData);
}

async function deleteChapter(spaceId, documentId, chapterId) {
    let client = await this.getClient(constants.DOCUMENTS_PLUGIN, spaceId);
    return await client.deleteChapter(documentId, chapterId);
}

async function changeChapterOrder(spaceId, documentId, chapterId, position) {
    let client = await this.getClient(constants.DOCUMENTS_PLUGIN, spaceId);
    return await client.changeChapterOrder(documentId, chapterId, position);
}

async function compileChapterVideo(spaceId, documentId, chapterId) {
    return await this.sendRequest(`/tasks/video/${spaceId}/${documentId}/${chapterId}`, "POST", {});
}
module.exports = {
    getChapter,
    addChapter,
    updateChapter,
    deleteChapter,
    changeChapterOrder,
    compileChapterVideo,
    getClient
}
