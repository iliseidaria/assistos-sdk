const {request} = require("../util");
const {getAPIClient} = require("../util/utils");
const constants = require("../../constants");

const Space = require('./models/Space.js');
async function sendRequest(url, method, data, headers, externalRequest) {
    return await request(url, method, data, this.__securityContext, headers, externalRequest);
}

async function getSpaceChat(spaceId, chatId) {
    return await this.sendRequest(`/spaces/chat/${spaceId}/${chatId}`, "GET")
}

async function addSpaceChatMessage(spaceId, chatId, messageData) {
    return await this.sendRequest(`/spaces/chat/${spaceId}/${chatId}`, "POST", messageData)
}

async function resetSpaceChat(spaceId, chatId) {
    return await this.sendRequest(`/spaces/chat/${spaceId}/${chatId}`, "DELETE")
}

async function saveSpaceChat(spaceId, chatId) {
    return await this.sendRequest(`/spaces/chat/save/${spaceId}/${chatId}`, "POST")
}

async function createSpace(spaceName, email) {
    return await this.sendRequest(`/spaces`, "POST", {spaceName, email});
}

async function getSpaceStatus(spaceId) {
    let requestURL = spaceId ? `/spaces/${spaceId}` : `/spaces`;
    return await this.sendRequest(requestURL, "GET");
}

async function deleteSpace(spaceId) {
    return await this.sendRequest(`/spaces/${spaceId}`, "DELETE");
}

async function deleteSecret(spaceId, secretKey) {
    return await this.sendRequest(`/spaces/${spaceId}/secrets/delete`, "PUT", {secretKey});
}

async function addSecret(spaceId, name, secretKey, value) {
    return await this.sendRequest(`/spaces/${spaceId}/secrets`, "POST", {name, secretKey, value});
}

async function editSecret(spaceId, name, secretKey, value) {
    return await this.sendRequest(`/spaces/${spaceId}/secrets`, "PUT", {name, secretKey, value});
}

async function getSecretsMasked(spaceId) {
    return await this.sendRequest(`/spaces/${spaceId}/secrets`, "GET");
}

async function getCollaborators(spaceId) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.getCollaborators();
}

async function removeCollaborator(spaceId, email) {
    let globalClient = await getAPIClient("*", constants.WORKSPACE_PLUGIN);
    await globalClient.unlinkSpaceFromUser(email, spaceId);

    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.removeCollaborator(email);
}

async function addCollaborators(referrerEmail, spaceId, collaborators, spaceName) {
    let globalAPIClient = await getAPIClient("*", constants.WORKSPACE_PLUGIN);
    let userEmails = collaborators.map(user => user.email);
    let userLoginClient = await getAPIClient("*", constants.USER_LOGIN_PLUGIN);
    for(let email of userEmails){
        let userModule = require("assistos").loadModule("user", this.__securityContext);
        let result = await userModule.userExists(email);
        if(!result.account_exists){
            let name = email.split("@")[0];
            await userLoginClient.createUser(email, name);
            await this.createSpace(name, email);
        }
    }
    await globalAPIClient.addSpaceToUsers(userEmails, spaceId);

    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.addCollaborators(referrerEmail, collaborators, spaceId, spaceName);
}

async function setCollaboratorRole(spaceId, email, role) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.setCollaboratorRole(email, role);
}

async function importPersonality(spaceId, personalityFormData) {
    return await this.sendRequest(`/spaces/${spaceId}/import/personalities`, "POST", personalityFormData);
}

async function getImageURL(imageId) {
    return await this.getFileURL(imageId, "image/png");
}

async function getAudioURL(audioId) {
    return await this.getFileURL(audioId, "audio/mp3");
}

async function getVideoURL(videoId) {
    return await this.getFileURL(videoId, "video/mp4");
}

async function getFileURL(fileId, type) {
    const downloadData = await this.sendRequest(`/spaces/downloads/${fileId}`, "GET", null, {"Content-Type": type});
    return downloadData.downloadURL;
}

async function getAudioHead(audioId) {
    return await this.headFile(audioId, "audio/mp3");
}

async function getImageHead(imageId) {
    return await this.headFile(imageId, "image/png");
}

async function getVideoHead(videoId) {
    return await this.headFile(videoId, "video/mp4");
}

async function headFile(fileId, type) {
    return await this.sendRequest(`/spaces/files/${fileId}`, "HEAD", null, {"Content-Type": type});
}

async function getAudio(audioId) {
    return await this.getFile(audioId, "audio/mp3");
}

async function getImage(imageId) {
    return await this.getFile(imageId, "image/png");
}

async function getVideo(videoId, range) {
    return await this.getFile(videoId, "video/mp4", range);
}

async function getFile(fileId, type, range) {
    const downloadData = await this.sendRequest(`/spaces/downloads/${fileId}`, "GET", null , {"Content-Type": type});

    let headers = {};
    if (range) {
        headers.Range = range;
    }
    return await this.sendRequest(downloadData.downloadURL, "GET", null, headers, downloadData.externalRequest);
}

async function putAudio(audio) {
    return await this.putFile(audio, "audio/mp3");
}

async function putImage(image) {
    return await this.putFile(image, "image/png");
}

async function putVideo(video) {
    return await this.putFile(video, "video/mp4");
}

async function putFile(file, type) {
    const uploadData = await this.sendRequest(`/spaces/uploads`, "GET", null, {"Content-Type": type});
    await this.sendRequest(uploadData.uploadURL, "PUT", file, {"Content-Type": type, "Content-Length": file.byteLength}, uploadData.externalRequest);
    return uploadData.fileId;
}

async function deleteImage(imageId) {
    return await this.deleteFile(imageId, "image/png");
}

async function deleteAudio(audioId) {
    return await this.deleteFile(audioId, "audio/mp3");
}

async function deleteVideo(videoId) {
    return await this.deleteFile(videoId, "video/mp4");
}

async function deleteFile(fileId, type) {
    return await this.sendRequest(`/spaces/files/${fileId}`, "DELETE", null, {"Content-Type": type});
}

async function startTelegramBot(spaceId, personalityId, botId){
    return await this.sendRequest(`/telegram/startBot/${spaceId}/${personalityId}`, "POST", botId);
}

async function removeTelegramUser(spaceId, personalityId, telegramUserId){
    return await this.sendRequest(`/telegram/auth/${spaceId}/${personalityId}`, "PUT", telegramUserId);
}



async function runCode(spaceId, commands, args) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    await client.runCode(commands, ...args);
    await client.buildAll();
}
async function buildAll(spaceId) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    await client.buildAll();
}
async function getGraph(spaceId) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.getGraph();
}
async function getVariables(spaceId) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.getEveryVariableObject();
}
async function getErrorsFromLastBuild(spaceId) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.getErrorFromLastBuild();
}
async function defineVariable(spaceId, name, type, documentId, chapterId, paragraphId, command) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.defineVariable(name, type, documentId, chapterId, paragraphId, command);
}
async function buildForDocument(spaceId, documentId) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.buildOnlyForDocument(documentId);
}
async function restartServerless(spaceId) {
    return await this.sendRequest(`/spaces/${spaceId}/restart`, "PUT", {});
}
async function getCommands(spaceId) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.getCommands();
}
async function getCustomTypes(spaceId) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.getCustomTypes();
}
module.exports = {
    createSpace,
    getSpaceStatus,
    deleteSpace,
    editSecret,
    addSecret,
    deleteSecret,
    addSpaceChatMessage,
    addCollaborators,
    sendRequest,
    getSecretsMasked,
    putImage,
    deleteImage,
    Space,
    putAudio,
    getAudio,
    deleteAudio,
    importPersonality,
    deleteVideo,
    putVideo,
    getVideo,
    getSpaceChat,
    getAudioHead,
    getImageHead,
    getImage,
    getVideoHead,
    getAudioURL,
    getVideoURL,
    getImageURL,
    getCollaborators,
    setCollaboratorRole,
    removeCollaborator,
    saveSpaceChat,
    resetSpaceChat,
    putFile,
    headFile,
    deleteFile,
    getFile,
    getFileURL,
    startTelegramBot,
    removeTelegramUser,
    runCode,
    buildAll,
    getGraph,
    getVariables,
    getErrorsFromLastBuild,
    defineVariable,
    buildForDocument,
    restartServerless,
    getCommands,
    getCustomTypes,
}



