const Chapter = require("./models/Chapter");
const {getAPIClient} = require("../util/utils");
const constants = require("../../constants");
async function getChapter(spaceId, documentId, chapterId) {
    let client = await getAPIClient("*", constants.DOCUMENTS_PLUGIN, spaceId);
    let chapter = await client.getChapter(documentId, chapterId);
    return new Chapter(chapter);
}

async function addChapter(spaceId, documentId, chapterTitle, commands, comments, position) {
    let client = await getAPIClient("*", constants.DOCUMENTS_PLUGIN, spaceId);
    return await client.createChapter(documentId, chapterTitle, commands, comments, position);
}

async function updateChapter(spaceId, chapterId, chapterTitle, commands, comments, additionalData) {
    let client = await getAPIClient("*", constants.DOCUMENTS_PLUGIN, spaceId);
    return await client.updateChapter(chapterId, chapterTitle, commands, comments, additionalData);
}

async function deleteChapter(spaceId, documentId, chapterId) {
    let client = await getAPIClient("*", constants.DOCUMENTS_PLUGIN, spaceId);
    return await client.deleteChapter(documentId, chapterId);
}

async function changeChapterOrder(spaceId, documentId, chapterId, position) {
    let client = await getAPIClient("*", constants.DOCUMENTS_PLUGIN, spaceId);
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
    compileChapterVideo
}
