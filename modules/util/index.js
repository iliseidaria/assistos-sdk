const constants = require("../../constants.js");

function fillTemplate(templateObject, fillObject, depth = 0) {
    /* Todo: Implement a detection mechanism for circular dependencies instead of a hardcoded nested depth limit */

    if (depth > 10) {
        throw new Error("Depth Overreach. Possible Circular Dependency");
    }

    const containsPlaceholder = (templateObjectValueString) => {
        const placeholderPattern = /\$\$[a-zA-Z0-9_]+(\?)?/g;
        return placeholderPattern.test(templateObjectValueString);
    }

    if (typeof templateObject === 'string') {
        if (containsPlaceholder(templateObject)) {
            let resultString = "";
            let buffer = "";
            let placeholder = "";
            let i = 0;

            while (i < templateObject.length) {
                if (templateObject[i] === '$' && templateObject[i + 1] === '$') {
                    if (buffer.length > 0) {
                        resultString += buffer;
                        buffer = "";
                    }
                    i += 2;
                    while (i < templateObject.length &&
                    /[\w?]/.test(templateObject[i])) {
                        placeholder += templateObject[i];
                        i++;
                    }
                    const optionalPlaceholder = placeholder.endsWith('?');
                    const placeholderKey = optionalPlaceholder ? placeholder.slice(0, -1) : placeholder;
                    if (fillObject.hasOwnProperty(placeholderKey)) {
                        let placeholderValue = fillObject[placeholderKey];
                        let isFullReplacement = templateObject.trim() === `$$${placeholderKey}` || templateObject.trim() === `$$${placeholderKey}?`;

                        if (typeof placeholderValue === 'object') {
                            if (!Array.isArray(placeholderValue) && !isFullReplacement) {
                                resultString += JSON.stringify(placeholderValue);
                            } else if (Array.isArray(placeholderValue) && !isFullReplacement) {
                                resultString += JSON.stringify(placeholderValue);
                            } else {
                                return placeholderValue;
                            }
                        } else if (placeholderValue === undefined && optionalPlaceholder) {
                            resultString += "";
                        } else {
                            resultString += placeholderValue.toString();
                        }
                    } else if (!optionalPlaceholder) {
                        throw new Error(`Missing required fill data for "${placeholderKey}"`);
                    }
                    placeholder = "";
                } else {
                    buffer += templateObject[i];
                    i++;
                }
            }
            resultString += buffer;
            return resultString;
        } else {
            return templateObject;
        }
    } else if (Array.isArray(templateObject)) {
        return templateObject.reduce((acc, currentElement) => {
            const replacedElement = fillTemplate(currentElement, fillObject, depth + 1);
            if (replacedElement !== "") {
                acc.push(replacedElement);
            }
            return acc;
        }, []);

    } else if (typeof templateObject === 'object') {
        const newObj = {};
        for (const [key, value] of Object.entries(templateObject)) {
            newObj[key] = fillTemplate(value, fillObject, depth + 1);
        }
        return newObj;
    } else {
        return templateObject;
    }
}

async function request(url, method, securityContext, data) {
    let result;
    let init = {
        method: method,
        headers: {}
    };

    if (method === "POST" || method === "PUT" || method === "DELETE") {
        if (data instanceof FormData) {
            init.body = data;
        } else {
            init.body = typeof data === "string" ? data : JSON.stringify(data);
            init.headers["Content-type"] = "application/json; charset=UTF-8";
        }
    }
    const assistOS = require("assistos");
    if (assistOS.envType === constants.ENV_TYPE.NODE) {
        url = `${constants[constants.ENVIRONMENT_MODE]}${url}`;
        init.headers.Cookie = securityContext.cookies;
    }
    try {
        result = await fetch(url, init);
    } catch (err) {
        console.error(err);
    }
    let response = await result.text()
    let responseJSON = JSON.parse(response);
    if (!responseJSON.success) {
        throw new Error(responseJSON.message);
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

let objectsToRefresh = [];
let refreshTimeout = null;
let refreshDelay = 2000;

function createSSEConnection(config) {
    if (typeof window !== 'undefined') {
            let eventSource = new EventSource(config.url, {withCredentials: true});

        eventSource.addEventListener('content', function (event) {
            let parsedData = JSON.parse(event.data);
            if (parsedData.isSameUser) {
                notificationService.emit(parsedData.objectId, parsedData.data);
            } else {
                objectsToRefresh.push({objectId: parsedData.objectId, data: parsedData.data});
                if (!refreshTimeout) {
                    refreshTimeout = setTimeout(() => {
                        for (let objects of objectsToRefresh) {
                            notificationService.emit(objects.objectId, objects.data);
                        }
                        objectsToRefresh = [];
                        refreshTimeout = null;
                    }, refreshDelay);
                }
            }
        });

        eventSource.addEventListener('disconnect', async (event) => {
            let disconnectReason = JSON.parse(event.data);
            eventSource.close();
            await config.onDisconnect(disconnectReason);
        })

        eventSource.onerror = async (err) => {
            eventSource.close();
            await config.onError(err);
        };

        return eventSource;
    } else {
        console.warn("This function is only available in the browser");
    }
}

async function closeSSEConnection() {
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

module.exports = {
    request,
    notificationService,
    fillTemplate,
    createSSEConnection,
    closeSSEConnection,
    subscribeToObject,
    unsubscribeFromObject
}