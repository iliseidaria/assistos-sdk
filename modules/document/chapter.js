const sendRequest = require("assistos").loadModule("util").sendRequest;

const documentType = "documents";
const chapterType = "chapters";
function getObjectId(objectType, objectId){
    return `${objectType}_${objectId}`;
}
async function getChapter(spaceId, documentId, chapterId){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}
async function addChapter(spaceId, documentId, chapterData){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${chapterType}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "POST", chapterData);
}
async function updateChapter(spaceId, documentId, chapterData){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterData.id)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", chapterData);
}
async function deleteChapter(spaceId, documentId, chapterId){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "DELETE");
}

async function swapChapters(spaceId, documentId, chapterId1, chapterId2){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${chapterType}`);
    let body = {
        item1: chapterId1,
        item2: chapterId2
    }
    return await sendRequest(`/spaces/embeddedObject/swap/${spaceId}/${objectURI}`, "PUT", body);
}
async function updateChapterTitle(spaceId, documentId, chapterId, title) {
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}/title`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", title);
}

async function updateChapterMainIdeas(spaceId, documentId, chapterId, mainIdeas){
    //mainIdeas is an array of strings
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}/mainIdeas`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", mainIdeas);
}
async function updateChapterAlternativeTitles(spaceId, documentId, chapterId, alternativeTitles){
    //alternativeTitles is an array of strings
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}/alternativeTitles`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", alternativeTitles);
}

async function getAlternativeChapter(spaceId, documentId, alternativeChapterId){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId("alternativeChapters", alternativeChapterId)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}
async function addAlternativeChapter(spaceId, documentId, chapterId, alternativeChapter){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}/alternativeChapters`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "POST", alternativeChapter);
}
async function updateAlternativeChapter(spaceId, documentId, alternativeChapter){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId("alternativeChapters", alternativeChapter.id)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", alternativeChapter);
}
async function deleteAlternativeChapter(spaceId, documentId, chapterId, alternativeChapterId){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}/${getObjectId("alternativeChapters", alternativeChapterId)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "DELETE");
}
module.exports = {
    addChapter,
    updateChapter,
    deleteChapter,
    swapChapters,
    updateChapterTitle,
    updateChapterMainIdeas,
    updateChapterAlternativeTitles,
    getAlternativeChapter,
    addAlternativeChapter,
    updateAlternativeChapter,
    deleteAlternativeChapter
}