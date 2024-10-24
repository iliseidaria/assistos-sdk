const constants = require("../../constants.js");
const envType = require("assistos").envType;

let objectsToRefresh = [];
let refreshDelay = 2000;
let eventSource;

async function request(url, method, securityContext, data) {
    let init = {
        method: method,
        headers: {}
    };
    if (method === "POST" || method === "PUT") {
        if (data instanceof FormData || typeof data === "function") {
            /* let the browser decide the content type */
            init.body = data;
        } else if (typeof data === "string") {
            init.body = data;
            init.headers["Content-Type"] = "text/plain; charset=UTF-8";
        } else if (data instanceof ArrayBuffer || Buffer.isBuffer(data) || data instanceof Uint8Array) {
            init.body = data;
            init.headers["Content-Type"] = "application/octet-stream";
        } else {
            init.body = JSON.stringify(data);
            init.headers["Content-Type"] = "application/json; charset=UTF-8";
        }
    }
    if (envType === constants.ENV_TYPE.NODE) {
        url = `${constants[constants.ENVIRONMENT_MODE]}${url}`;
        init.headers.Cookie = securityContext.cookies;
    }
    let response;
    try {
        response = await fetch(url, init);
    } catch (err) {
        console.error(err);
    }
    const contentType = response.headers.get('Content-Type');
    if (contentType === 'application/zip') {
        return await response.blob();
    }
    if (contentType.includes('audio/') || contentType.includes('image/') || contentType.includes('video/') || contentType.includes('application/octet-stream')) {
        return await response.arrayBuffer();
    }
    if (method.toUpperCase() === "HEAD") {
        return response.ok;
    }
    const responseJSON = await response.json();
    if (!responseJSON.success) {
        let errorData = {
            status: response.status,
            message: responseJSON.message
        }
        throw new Error(JSON.stringify(errorData));
    }
    return responseJSON.data;
}

const notificationService = (function createNotificationService() {
    const listeners = {};

    function on(event, callback) {
        if (!listeners[event]) {
            listeners[event] = [];
        }
        listeners[event].push(callback);
    }

    function off(event) {
        delete listeners[event];
    }

    function emit(event, data) {
        const eventListeners = listeners[event] || [];
        eventListeners.forEach(callback => callback(data));
    }

    return {
        on,
        emit,
        off
    };
})();



function createSSEConnection(config) {
    if (typeof window !== 'undefined') {
        eventSource = new EventSource(config.url, {withCredentials: true});
        let intervalId = setInterval(() => {
            for (let objects of objectsToRefresh) {
                notificationService.emit(objects.objectId, objects.data);
            }
            objectsToRefresh = [];
        }, refreshDelay);
        eventSource.intervalId = intervalId;
        eventSource.addEventListener('content', function (event) {
            console.log("Notification received");
            let parsedMessage = JSON.parse(event.data);
            objectsToRefresh.push({objectId: parsedMessage.objectId, data: parsedMessage.data});
        });

        eventSource.addEventListener('disconnect', async (event) => {
            let disconnectReason = JSON.parse(event.data);
            clearInterval(intervalId);
            eventSource.close();
            await config.onDisconnect(disconnectReason);
        })
        eventSource.onerror = async (err) => {
            eventSource.close();
            clearInterval(intervalId);
            await config.onError(err);
        };
        console.log("SSE Connection created");
        eventSource.intervalId = intervalId;
        return eventSource;
    } else {
        console.warn("This function is only available in the browser");
    }
}

async function closeSSEConnection(eventSource) {
    clearInterval(eventSource.intervalId);
    await this.request("/events/close", "GET");
}

async function unsubscribeFromObject(objectId) {
    notificationService.off(objectId);
    let encodedObjectId = encodeURIComponent(objectId);
    await this.request(`/events/unsubscribe/${encodedObjectId}`, "GET");
}

async function subscribeToObject(objectId, handler) {
    notificationService.on(objectId, handler);
    let encodedObjectId = encodeURIComponent(objectId);
    await this.request(`/events/subscribe/${encodedObjectId}`, "GET");
}

async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}

module.exports = {
    request,
    NotificationRouter : require('./NotificationRouter.js'),
    notificationService,
    createSSEConnection,
    closeSSEConnection,
    subscribeToObject,
    unsubscribeFromObject,
    sendRequest,
}
