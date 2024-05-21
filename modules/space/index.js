const {request, notificationService} = require("../util");
const Space = require('./models/Space.js');
const Announcement = require('./models/Announcement.js');
const announcementType = "announcements";
async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}
async function addAnnouncement(spaceId, announcementData){
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${announcementType}`, "POST", announcementData)
}
async function updateAnnouncement(spaceId, announcementId, announcementData){
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${announcementType}/${announcementId}`, "PUT", announcementData)
}
async function deleteAnnouncement(spaceId, announcementId){
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${announcementType}/${announcementId}`, "DELETE")
}
async function addSpaceChatMessage(spaceId, messageData){
    return await this.sendRequest(`/spaces/${spaceId}/chat`, "POST", messageData)
}
async function createSpace(spaceName, apiKey) {
    const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        apiKey: apiKey,
        Cookie: this.__securityContext.cookies
    };
    const bodyObject = {
        spaceName: spaceName
    }
    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(bodyObject)
    };
    const response = await fetch(`/spaces`, options);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${response.message}`);
    }

    return (await response.json()).data;
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

async function inviteSpaceCollaborators(spaceId, collaboratorEmails) {
    return await this.sendRequest(`/spaces/${spaceId}/collaborators`, "POST", {emails:collaboratorEmails});
}
async function unsubscribeFromObject(spaceId, objectId){
    return await this.sendRequest(`/updates/unsubscribe/${spaceId}/${objectId}`, "GET");
}
async function subscribeToObject(spaceId, objectId) {
    return await this.sendRequest(`/updates/subscribe/${spaceId}/${objectId}`, "GET");
}
let delay = 1000;
const refreshDelay = 3000;
let objectsToRefresh = [];
let refreshTimeout;
let checkUpdatesTimeoutId;
let stopPolling = false;
function startCheckingUpdates(spaceId) {
    stopPolling = false;
    const bindCheckUpdates = checkUpdates.bind(this);
    bindCheckUpdates(spaceId);
}
async function checkUpdates(spaceId) {
    try {
        if(stopPolling) {
            return;
        }
        let data = await this.sendRequest(`/updates/${spaceId}`, "GET");
        if (data) {
            if (data.isSameUser) {
                notificationService.emit(data.targetObjectId);
            } else {
                objectsToRefresh.push(data.targetObjectId);
                if (!refreshTimeout) {
                    refreshTimeout = setTimeout(() => {
                        for (let objectId of objectsToRefresh) {
                            notificationService.emit(objectId);
                        }
                        objectsToRefresh = [];
                        refreshTimeout = null;
                    }, refreshDelay);
                }
            }
        }
    } catch (error) {
        console.error("Error fetching updates:", error);
    }
    if(!stopPolling) {
        checkUpdatesTimeoutId = setTimeout(() => {
            const bindCheckUpdates = checkUpdates.bind(this);
            bindCheckUpdates(spaceId);
        }, delay);
    }
}
function stopCheckingUpdates() {
    stopPolling = true;
    clearTimeout(checkUpdatesTimeoutId);
}
module.exports={
    createSpace,
    loadSpace,
    deleteSpace,
    storeSpace,
    addKeyToSpace,
    addSpaceChatMessage,
    addAnnouncement,
    inviteSpaceCollaborators,
    subscribeToObject,
    unsubscribeFromObject,
    startCheckingUpdates,
    stopCheckingUpdates,
    sendRequest,
    Space,
    Announcement
}



