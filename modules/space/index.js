const {request} = require("../util");
const Space = require('./models/Space.js');
const Announcement = require('./models/Announcement.js');
const constants = require("../../constants");
const envType = require("assistos").envType;
async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}

async function addSpaceAnnouncement(spaceId, announcementData) {
    return await this.sendRequest(`/spaces/${spaceId}/announcements`, "POST", announcementData)
}

async function getSpaceAnnouncement(spaceId, announcementId) {
    return await this.sendRequest(`/spaces/${spaceId}/announcements/${announcementId}`, "GET")
}

async function getSpaceChat(spaceId,chatId) {
    return await this.sendRequest(`/spaces/chat/${spaceId}/${chatId}`, "GET")
}
async function addSpaceChatMessage(spaceId,chatId, messageData) {
    return await this.sendRequest(`/spaces/chat/${spaceId}/${chatId}`, "POST", messageData)
}
async function resetSpaceChat(spaceId,chatId){
    return await this.sendRequest(`/spaces/chat/${spaceId}/${chatId}`, "DELETE")
}
async function saveSpaceChat(spaceId,chatId){
    return await this.sendRequest(`/spaces/chat/save/${spaceId}/${chatId}`, "POST")
}
async function getSpaceAnnouncements(spaceId) {
    return await this.sendRequest(`/spaces/${spaceId}/announcements`, "GET")
}

async function deleteSpaceAnnouncement(spaceId, announcementId) {
    return await this.sendRequest(`/spaces/${spaceId}/announcements/${announcementId}`, "DELETE")
}

async function updateSpaceAnnouncement(spaceId, announcementId, announcementData) {
    return await this.sendRequest(`/spaces/${spaceId}/announcements/${announcementId}`, "PUT", announcementData)
}



async function createSpace(spaceName) {
    const bodyObject = {
        spaceName: spaceName
    }
    return await this.sendRequest(`/spaces`, "POST", bodyObject);
}

async function loadSpace(spaceId) {
    let requestURL = spaceId ? `/spaces/${spaceId}` : `/spaces`;
    return await this.sendRequest(requestURL, "GET");
}

async function storeSpace(spaceId, jsonData = null, apiKey = null, userId = null) {
    let headers = {
        "Content-type": "application/json; charset=UTF-8",
        Cookie: this.__securityContext.cookies
    };
    if (apiKey) {
        headers["apikey"] = `${apiKey}`;
        headers["initiatorid"] = `${userId}`;
    }

    let options = {
        method: "PUT",
        headers: headers,
        body: jsonData
    };
    let response = await fetch(`/spaces/${spaceId}`, options);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${response.message}`);
    }

    return await response.text();
}

async function deleteSpace(spaceId) {
    return await this.sendRequest(`/spaces/${spaceId}`, "DELETE");
}

async function addKeyToSpace(spaceId, userId, keyType, apiKey) {
    let result;
    let headers = {
        "Content-type": "application/json; charset=UTF-8",
        Cookie: this.__securityContext.cookies
    };
    if (apiKey) {
        headers["apikey"] = `${apiKey}`;
        headers["initiatorid"] = `${userId}`;
    }
    try {
        result = await fetch(`/spaces/${spaceId}/secrets`,
            {
                method: "POST",
                headers: headers
            });
    } catch (err) {
        console.error(err);
    }
    return await result.text();
}

async function getAPIKeysMetadata(spaceId) {
    return await this.sendRequest(`/spaces/${spaceId}/secrets/keys`, "GET");
}

async function getSpaceCollaborators(spaceId) {
    return await this.sendRequest(`/spaces/collaborators/${spaceId}`, "GET");
}

async function deleteSpaceCollaborator(spaceId, userId) {
    return await this.sendRequest(`/spaces/collaborators/${spaceId}/${userId}`, "DELETE");
}

async function inviteSpaceCollaborators(spaceId, collaborators) {
    return await this.sendRequest(`/spaces/collaborators/${spaceId}`, "POST", {collaborators});
}
async function setSpaceCollaboratorRole(spaceId, userId, role) {
    return await this.sendRequest(`/spaces/collaborators/${spaceId}/${userId}`, "PUT", {role});
}

async function deleteImage(spaceId, imageId) {
    return await this.sendRequest(`/spaces/images/${spaceId}/${imageId}`, "DELETE");
}

async function sendGeneralRequest(url, method, data = null, headers = {}) {
    let response;
    if (envType === constants.ENV_TYPE.NODE) {
        headers.Cookie = this.__securityContext.cookies;
    }
    try {
        response = await fetch(url, {
            method: method,
            headers: headers,
            body: data || undefined
        });
    } catch (err) {
        console.error(err);
    }
    if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
    }
    switch (response.headers.get("Content-Type")) {
        case "application/json":
            return (await response.json()).data;
        case "application/octet-stream":
        case "audio/mp3":
        case "video/mp4":
        case "image/png":
            return await response.arrayBuffer();
        case "text/plain":
        default :
            return await response.text();
    }
}
async function putAudio(audio) {
    const {uploadURL, fileId} = await this.sendRequest(`/spaces/uploads/audios`, "GET");
    await this.sendGeneralRequest(uploadURL, "PUT", audio, {"Content-Type": "audio/mp3"});
    return fileId;
}
async function putImage(image) {
    const {uploadURL, fileId} = await this.sendRequest(`/spaces/uploads/images`, "GET");
    await this.sendGeneralRequest(uploadURL, "PUT", image, {"Content-Type": "image/png"});
    return fileId;
}
async function putVideo(video) {
    const {uploadURL, fileId} = await this.sendRequest(`/spaces/uploads/videos`, "GET");
    await this.sendGeneralRequest(uploadURL, "PUT", video, {"Content-Type": "video/mp4"});
    return fileId;
}
async function getAudio(audioId) {
    const {downloadURL} = await this.sendRequest(`/spaces/downloads/audios/${audioId}`, "GET");
    return await this.sendGeneralRequest(downloadURL, "GET", null);
}

async function getImage(imageId) {
    const {downloadURL} = await this.sendRequest(`/spaces/downloads/images/${imageId}`, "GET");
    return await this.sendGeneralRequest(downloadURL, "GET", null);
}

async function getVideo(videoId, range) {
    const {downloadURL} = await this.sendRequest(`/spaces/downloads/videos/${videoId}`, "GET");
    return await this.sendGeneralRequest(downloadURL, "GET", null, {...range ? {"Range": range} : {}});
}
async function getImageURL(imageId) {
    const {downloadURL} = await this.sendRequest(`/spaces/downloads/images/${imageId}`, "GET");
    return downloadURL;
}
async function getAudioURL(audioId) {
    const {downloadURL} = await this.sendRequest(`/spaces/downloads/audios/${audioId}`, "GET");
    return downloadURL;
}
async function getVideoURL(imageId) {
    const {downloadURL} = await this.sendRequest(`/spaces/downloads/videos/${imageId}`, "GET");
    return downloadURL;
}

async function deleteAudio(audioId) {
    return await this.sendRequest(`/spaces/audios/${audioId}`, "DELETE");
}

async function importPersonality(spaceId, personalityFormData) {
    return await this.sendRequest(`/spaces/${spaceId}/import/personalities`, "POST", personalityFormData);
}

async function deleteVideo(videoId) {
    return await this.sendRequest(`/spaces/videos/${videoId}`, "DELETE");
}

async function getAudioHead(audioId) {
    return await this.sendRequest(`/spaces/audios/${audioId}`, "HEAD");
}

async function getImageHead(imageId) {
    return await this.sendRequest(`/spaces/images/${imageId}`, "HEAD");
}

async function getVideoHead(videoId) {
    return await this.sendRequest(`/spaces/videos/${videoId}`, "HEAD");
}

module.exports = {
    createSpace,
    loadSpace,
    deleteSpace,
    storeSpace,
    addKeyToSpace,
    addSpaceChatMessage,
    addSpaceAnnouncement,
    getSpaceAnnouncement,
    getSpaceAnnouncements,
    updateSpaceAnnouncement,
    deleteSpaceAnnouncement,
    inviteSpaceCollaborators,
    sendRequest,
    getAPIKeysMetadata,
    putImage,
    deleteImage,
    Space,
    Announcement,
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
    sendGeneralRequest,
    getSpaceCollaborators,
    setSpaceCollaboratorRole,
    deleteSpaceCollaborator,
    saveSpaceChat,
    resetSpaceChat,
}



