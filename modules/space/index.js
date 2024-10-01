const {request, notificationService} = require("../util");
const Space = require('./models/Space.js');
const Announcement = require('./models/Announcement.js');
const constants = require("../../constants");

async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}

async function addSpaceAnnouncement(spaceId, announcementData) {
    return await this.sendRequest(`/spaces/${spaceId}/announcements`, "POST", announcementData)
}

async function getSpaceAnnouncement(spaceId, announcementId) {
    return await this.sendRequest(`/spaces/${spaceId}/announcements/${announcementId}`, "GET")
}
async function getSpaceChat(spaceId) {
    return await this.sendRequest(`/spaces/${spaceId}/chat`, "GET")
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

async function addSpaceChatMessage(spaceId, messageData) {
    return await this.sendRequest(`/spaces/${spaceId}/chat`, "POST", messageData)
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

async function inviteSpaceCollaborators(spaceId, collaboratorEmails) {
    return await this.sendRequest(`/spaces/${spaceId}/collaborators`, "POST", {emails: collaboratorEmails});
}
async function getImage(spaceId, imageId) {
    return await this.sendRequest(`/spaces/image/${spaceId}/${imageId}`, "GET");
}
async function addImage(spaceId, image) {
    return await this.sendRequest(`/spaces/image/${spaceId}`, "POST", image);
}
async function deleteImage(spaceId, imageId) {
    return await this.sendRequest(`/spaces/image/${spaceId}/${imageId}`, "DELETE");
}
async function addAudio(spaceId, audio) {
    return await this.sendRequest(`/spaces/audio/${spaceId}`, "POST", audio);
}
async function getAudio(spaceId, audioId) {
    return await this.sendRequest(`/spaces/audio/${spaceId}/${audioId}`, "GET");
}
async function deleteAudio(spaceId, audioId) {
    return await this.sendRequest(`/spaces/audio/${spaceId}/${audioId}`, "DELETE");
}
async function importPersonality(spaceId,personalityFormData){
    return await this.sendRequest(`/spaces/${spaceId}/import/personalities`, "POST", personalityFormData);
}
async function addVideo(spaceId, video) {
    return await this.sendRequest(`/spaces/video/${spaceId}`, "POST", video);
}
async function getVideo(spaceId, videoId, range) {
    let url = `/spaces/video/${spaceId}/${videoId}`;
    let init = {
        method: "GET",
        headers: {
            Range: range
        }
    };
    const assistOS = require("assistos");
    if (assistOS.envType === constants.ENV_TYPE.NODE) {
        url = `${constants[constants.ENVIRONMENT_MODE]}${url}`;
        init.headers.Cookie = this.__securityContext.cookies;
    }
    let response;
    try {
        response = await fetch(url, init);
    } catch (err) {
        console.error(err);
    }
    if(!response.ok){
        throw new Error(`Failed to fetch video: ${response.statusText}`);
    }
    return await response.arrayBuffer();
}
async function deleteVideo(spaceId, videoId) {
    return await this.sendRequest(`/spaces/video/${spaceId}/${videoId}`, "DELETE");
}
async function getAudioHead(spaceId, audioId) {
    return await this.sendRequest(`/spaces/audio/${spaceId}/${audioId}`, "HEAD");
}
async function getImageHead(spaceId, imageId) {
    return await this.sendRequest(`/spaces/image/${spaceId}/${imageId}`, "HEAD");
}
async function getVideoHead(spaceId, videoId) {
    return await this.sendRequest(`/spaces/video/${spaceId}/${videoId}`, "HEAD");
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
    addImage,
    deleteImage,
    Space,
    Announcement,
    addAudio,
    getAudio,
    deleteAudio,
    importPersonality,
    deleteVideo,
    addVideo,
    getVideo,
    getSpaceChat,
    getAudioHead,
    getImageHead,
    getImage,
    getVideoHead
}



