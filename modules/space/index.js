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

async function importPersonality(spaceId, personalityFormData) {
    return await this.sendRequest(`/spaces/${spaceId}/import/personalities`, "POST", personalityFormData);
}

async function sendGeneralRequest(url, method, data = null, headers = {}, externalRequest = false) {
    let response;
    if (envType === constants.ENV_TYPE.NODE && !externalRequest) {
        headers.Cookie = this.__securityContext.cookies;
        url = `${constants[constants.ENVIRONMENT_MODE]}${url}`;
    }
    try {
        response = await fetch(url, {
            method: method,
            headers: headers,
            body: data || undefined
        });
    } catch (err) {
        throw new Error(err.message);
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
    const {downloadURL} = await this.sendGeneralRequest(`/spaces/downloads/${fileId}`, "GET", null, {"Content-Type": type});
    return downloadURL;
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
    return await this.sendGeneralRequest(`/spaces/files/${fileId}`, "HEAD", null, {"Content-Type": type});
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
    const {downloadURL} = await this.sendGeneralRequest(`/spaces/downloads/${fileId}`, "GET", null , {"Content-Type": type});
    let headers = {"Content-Type": type};
    if (range) {
        headers.Range = range;
    }
    return await this.sendGeneralRequest(downloadURL, "GET", null, headers, true);
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
    const {uploadURL, fileId} = await this.sendGeneralRequest(`/spaces/uploads`, "GET", null, {"Content-Type": type});
    await this.sendGeneralRequest(uploadURL, "PUT", file, {"Content-Type": type, "Content-Length": file.byteLength}, true);
    return fileId;
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
    return await this.sendGeneralRequest(`/spaces/files/${fileId}`, "DELETE", null, {"Content-Type": type});
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
    putFile,
    headFile,
    deleteFile,
    getFile,
    getFileURL
}



