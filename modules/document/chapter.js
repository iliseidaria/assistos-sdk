async function getChapter(spaceId, documentId, chapterId){
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}
async function addChapter(spaceId, documentId, chapterData){
    let objectURI = encodeURIComponent(`${documentId}/chapters`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "POST", chapterData);
}
async function updateChapter(spaceId, documentId, chapterData){
    let objectURI = encodeURIComponent(`${documentId}/${chapterData.id}`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", chapterData);
}
async function deleteChapter(spaceId, documentId, chapterId){
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "DELETE");
}

async function swapChapters(spaceId, documentId, chapterId1, chapterId2){
    let objectURI = encodeURIComponent(`${documentId}/chapters`);
    let body = {
        item1: chapterId1,
        item2: chapterId2
    }
    return await this.sendRequest(`/spaces/embeddedObject/swap/${spaceId}/${objectURI}`, "PUT", body);
}
async function getChapterTitle(spaceId, documentId, chapterId){
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}/title`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}
async function updateChapterTitle(spaceId, documentId, chapterId, title) {
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}/title`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", title);
}
async function updateChapterVisibility(spaceId, documentId, chapterId, visibility){
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}/visibility`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", visibility);
}
async function updateChapterMainIdeas(spaceId, documentId, chapterId, mainIdeas){
    //mainIdeas is an array of strings
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}/mainIdeas`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", mainIdeas);
}
async function updateChapterAlternativeTitles(spaceId, documentId, chapterId, alternativeTitles){
    //alternativeTitles is an array of strings
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}/alternativeTitles`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", alternativeTitles);
}

async function getAlternativeChapter(spaceId, documentId, alternativeChapterId){
    let objectURI = encodeURIComponent(`${documentId}/${alternativeChapterId}`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}
async function addAlternativeChapter(spaceId, documentId, chapterId, alternativeChapter){
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}/alternativeChapters`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "POST", alternativeChapter);
}
async function updateAlternativeChapter(spaceId, documentId, alternativeChapter){
    let objectURI = encodeURIComponent(`${documentId}/${ alternativeChapter.id}`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", alternativeChapter);
}
async function deleteAlternativeChapter(spaceId, documentId, chapterId, alternativeChapterId){
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}/${alternativeChapterId}`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "DELETE");
}
async function getChapterBackgroundSound(spaceId, documentId, chapterId){
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}/backgroundSound`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}
async function updateChapterBackgroundSound(spaceId, documentId, chapterId, backgroundSound){
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}/backgroundSound`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", backgroundSound);
}
async function deleteChapterBackgroundSound(spaceId, documentId, chapterId){
    let objectURI = encodeURIComponent(`${documentId}/${chapterId}/backgroundSound`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "DELETE");
}
module.exports = {
    getChapter,
    addChapter,
    updateChapter,
    deleteChapter,
    swapChapters,
    getChapterTitle,
    updateChapterTitle,
    updateChapterVisibility,
    updateChapterMainIdeas,
    updateChapterAlternativeTitles,
    getAlternativeChapter,
    addAlternativeChapter,
    updateAlternativeChapter,
    deleteAlternativeChapter,
    getChapterBackgroundSound,
    updateChapterBackgroundSound,
    deleteChapterBackgroundSound
}