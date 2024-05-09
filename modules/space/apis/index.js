const {sendRequest, eventEmitter} = require("assistos").loadModule("util");
const announcementType = "announcements";
async function addAnnouncement(spaceId, announcementData){
    return await sendRequest(`/spaces/spaceObject/${spaceId}/${announcementType}`, "POST", announcementData)
}
async function updateAnnouncement(spaceId, announcementId, announcementData){
    return await sendRequest(`/spaces/spaceObject/${spaceId}/${announcementType}/${announcementId}`, "PUT", announcementData)
}
async function deleteAnnouncement(spaceId, announcementId){
    return await sendRequest(`/spaces/spaceObject/${spaceId}/${announcementType}/${announcementId}`, "DELETE")
}
async function addSpaceChatMessage(spaceId, messageData){
    return await sendRequest(`/spaces/${spaceId}/chat`, "POST", messageData)
}
async function createSpace(spaceName, apiKey) {
    const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        apiKey: apiKey
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
    const headers = {
        "Content-Type": "application/json; charset=UTF-8",
    };
    const options = {
        method: "GET",
        headers: headers,
    };

    let requestURL = spaceId ? `/spaces/${spaceId}` : `/spaces`;

    const response = await fetch(requestURL, options);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${response.message}`);
    }

    return (await response.json()).data;

}

async function storeSpace(spaceId, jsonData = null, apiKey = null, userId = null) {
    let headers = {
        "Content-type": "application/json; charset=UTF-8"
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
    const headers = {
        "Content-Type": "application/json; charset=UTF-8",
    };
    const options = {
        method: "DELETE",
        headers: headers,
    };
    const response= await fetch(`/spaces/${spaceId}`, options);
    if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${response.message}`);

    }
}

async function addKeyToSpace(spaceId, userId, keyType, apiKey) {
    let result;
    let headers = {
        "Content-type": "application/json; charset=UTF-8"
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

async function loadObject(spaceId, objectType, objectName) {
    const result = await fetch(`/spaces/${spaceId}/objects/${objectType}/${objectName}`,
        {
            method: "GET"
        });
    return await result.text();
}

async function storeObject(spaceId, objectType, objectName, jsonData) {
    let result;
    try {
        result = await fetch(`/spaces/${spaceId}/objects/${objectType}/${objectName}`,
            {
                method: "PUT",
                body: jsonData,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });
    } catch (err) {
        console.error(err);
    }
    return await result.text();
}

async function inviteSpaceCollaborators(spaceId, collaboratorEmails) {
    let result;
    try {
        result = await fetch(`/spaces/${spaceId}/collaborators`,
            {
                method: "POST",
                body: JSON.stringify({emails:collaboratorEmails}),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                }
            });
    } catch (err) {
        console.error(err);
    }
    return await result.text();
}
async function unsubscribeFromObject(spaceId){
    return await sendRequest(`/spaces/updates/${spaceId}`, "POST", {action:"unsubscribe"});
}
let delay = 3000;
//const maxDelay = 30000;
//first call also subscribes to the object, recursive calls are for checking updates
async function checkUpdates(spaceId, objectId){
   let data = await sendRequest(`/spaces/updates/${spaceId}`, "POST", {objectId:objectId});
   if(data){
       eventEmitter.emit(data.targetObjectType, data.targetObjectId);
       await checkUpdates(spaceId);
   } else {
       setTimeout(async ()=> await checkUpdates(spaceId), delay);
       //delay = delay + 100;
       //delay = Math.min(delay, maxDelay);
   }
}
module.exports={
    createSpace,
    loadSpace,
    deleteSpace,
    storeSpace,
    addKeyToSpace,
    loadObject,
    addSpaceChatMessage,
    storeObject,
    addAnnouncement,
    inviteSpaceCollaborators,
    unsubscribeFromObject,
    checkUpdates
}