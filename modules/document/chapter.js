const Chapter = require("./models/Chapter");
const {getAPIClient} = require("../util/utils");
const constants = require("../../constants");
async function getChapter(spaceId, documentId, chapterId) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    let chapter = await client.getChapter(documentId, chapterId);
    return new Chapter(chapter);
}

async function addChapter(spaceId, documentId, chapterTitle, commands, comments) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.createChapter(documentId, chapterTitle, commands, comments);
}

async function updateChapter(spaceId, documentId, chapterTitle, comments, commands, additionalData) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.updateChapter(documentId, chapterTitle, commands, comments, additionalData);
}

async function deleteChapter(spaceId, documentId, chapterId) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.deleteChapter(documentId, chapterId);
}

async function swapChapters(spaceId, documentId, chapterId, position) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
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
    swapChapters,
    compileChapterVideo
}
