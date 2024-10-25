const constants = require("../../constants.js");
const envType = require("assistos").envType;

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

function unescapeHTML(value) {
    if (value != null && typeof value === "string") {
        return value.replace(/&amp;/g, '&')
            .replace(/&#39;/g, `'`)
            .replace(/&quot;/g, '"')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&#13;/g, '\n')
            .replace(/&nbsp;/g, ' ');
    }
    return value;
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
let refreshDelay = 2000;
let eventSource;

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
function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);

    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
}

function buildCommandsString(commandsObject) {
    const sortedCommandsArray = getSortedCommandsArray(commandsObject);
    return sortedCommandsArray.map(command => {
        let name = command.name;
        delete command.name;
        return buildCommandString(name, command || {});
    }).join("\n");
}

function buildCommandString(commandType, parameters) {
    const commandName = commandType;
    const parametersString = Object.entries(parameters)
        .map(([key, value]) => {
            return `${key}=${value}`;
        })
        .join(' ');
    return `${commandName} ${parametersString};`
}

function getSortedCommandsArray(commandsObject) {
    Object.keys(commandsObject).forEach(key => {
        commandsObject[key].name = key;
    });
    return Object.values(commandsObject).sort((a, b) => {
        return constants.COMMANDS_CONFIG.ORDER.indexOf(a.name) - constants.COMMANDS_CONFIG.ORDER.indexOf(b.name);
    }).reduce((acc, command) => {
        if (constants.COMMANDS_CONFIG.ORDER.includes(command.name)) {
            acc.push(command);
        }
        return acc
    }, []);
}

function findCommands(input) {
    input = unescapeHTML(input);
    input = input.trim();

    const commandsArray = input.split(';').map(cmd => cmd.trim()).filter(cmd => cmd !== '');
    const result = {};

    const regex = /^(\w+)(\s+.*)?$/;
    let foundCommands = {}

    for (const commandStr of commandsArray) {
        const match = commandStr.match(regex);
        if (!match) {
            return {invalid: true, error: `Invalid command format: "${commandStr}"`};
        }
        const commandName = match[1];
        if (foundCommands[commandName]) {
            return {invalid: true, error: `Duplicate command "${commandName}" detected`};
        }
        foundCommands[commandName] = match[2] ? match[2].trim() : '';
    }


    for (const commandName in foundCommands) {
        const commandParamsString = foundCommands[commandName];
        const commandConfig = constants.COMMANDS_CONFIG.COMMANDS.find(cmd => cmd.NAME === commandName);
        if (!commandConfig) {
            return {invalid: true, error: `Unknown command "${commandName}"`};
        }
        if (commandConfig.REQUIRED) {
            for (let requiredCommand of commandConfig.REQUIRED) {
                if (!foundCommands[requiredCommand]) {
                    return {
                        invalid: true,
                        error: `Command "${commandName}" requires "${requiredCommand}" to be present`
                    };
                }
            }
        }

        for (let previousCommandKey of Object.keys(result)) {
            if (!commandConfig.ALLOWED_ALONG) {
                continue;
            }
            let previousCommandConfig = constants.COMMANDS_CONFIG.COMMANDS.find(cmd => cmd.NAME === previousCommandKey);
            if (!previousCommandConfig.ALLOWED_ALONG) {
                continue;
            }
            if (!commandConfig.ALLOWED_ALONG.includes(previousCommandKey) && !previousCommandConfig.ALLOWED_ALONG.includes(commandName)) {
                return {
                    invalid: true,
                    error: `Command "${commandName}" is not allowed alongside "${previousCommandKey}"`
                };
            }
        }
        const paramsObject = {};
        if (commandParamsString) {
            let paramsArray = commandParamsString.split(/\s+/);
            for (let param of paramsArray) {
                if (param.includes('=')) {
                    let [name, value] = param.split('=');
                    let parameter = commandConfig.PARAMETERS?.find(p => p.NAME === name);
                    if (!parameter) {
                        return {invalid: true, error: `Unknown parameter "${name}" in command: "${commandName}"`};
                    }
                    if (parameter.TYPE === 'number') {
                        value = parseFloat(value);
                        if (isNaN(value) || value < parameter.MIN_VALUE || value > parameter.MAX_VALUE) {
                            return {
                                invalid: true,
                                error: `Invalid value for parameter "${name}" in command: "${commandName}"`
                            };
                        }
                    } else if (parameter.TYPE === 'string' && parameter.VALUES && !parameter.VALUES.includes(value)) {
                        return {invalid: true, error: `Invalid value "${value}" for parameter "${name}"`};
                    }
                    paramsObject[name] = value;
                } else {
                    return {
                        invalid: true,
                        error: `Invalid parameter format "${param}" in command: "${commandName}"`
                    };
                }
            }
            for (let configParam of commandConfig.PARAMETERS) {
                if (configParam.REQUIRED && !paramsObject[configParam.NAME]) {
                    return {
                        invalid: true,
                        error: `Missing required parameter "${configParam.NAME}" in command: "${commandName}"`
                    };
                }
            }
        }
        result[commandName] = paramsObject;

    }
    return result;
}

function getCommandsDifferences(commandsObject1, commandsObject2) {
    const differencesObject = {};
    const keys1 = Object.keys(commandsObject1);
    const keys2 = Object.keys(commandsObject2);

    for (const key of keys1) {
        if (!keys2.includes(key)) {
            differencesObject[key] = "deleted"; // command no longer exists in the updated commands config
        } else {
            differencesObject[key] = areCommandsDifferent(commandsObject1[key], commandsObject2[key]) ? "changed" : "same";
        }
    }

    for (const key of keys2) {
        if (!keys1.includes(key)) {
            differencesObject[key] = "new"; // command is new in the updated commands config
        }
    }
    return differencesObject;
}

function areCommandsDifferent(commandObj1, commandObj2) {
    const keys1 = Object.keys(commandObj1);
    const keys2 = Object.keys(commandObj2);

    if (keys1.length !== keys2.length) {
        return true;
    }

    for (let key of keys1) {
        if (commandObj1[key] !== commandObj2[key]) {
            return true;
        }
    }

    for (let key of keys2) {
        if (!keys1.includes(key)) {
            return true;
        }
    }
    return false;
}

function unsanitize(value) {
    if (value != null && typeof value === "string") {
        return value.replace(/&nbsp;/g, ' ')
            .replace(/&#13;/g, '\n')
            .replace(/&amp;/g, '&')
            .replace(/&#39;/g, "'")
            .replace(/&quot;/g, '"')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
    }
    return '';
}

function sanitize(value) {
    if (value != null && typeof value === "string") {
        return value.replace(/&/g, '&amp;')
            .replace(/'/g, '&#39;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\r\n/g, '&#13;')
            .replace(/[\r\n]/g, '&#13;').replace(/\s/g, '&nbsp;');
    }
    return value;
}

async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}

async function cancelTask(taskId) {
    return await this.sendRequest(`/tasks/cancel/${taskId}`, "DELETE");
}

async function cancelTaskAndRemove(taskId) {
    return await this.sendRequest(`/tasks/remove/${taskId}`, "DELETE");
}

async function removeTask(taskId) {
    return await this.sendRequest(`/tasks/remove/${taskId}`, "DELETE");
}

async function getTasks(spaceId) {
    return await this.sendRequest(`/tasks/space/${spaceId}`, "GET");
}

async function getTask(taskId) {
    return await this.sendRequest(`/tasks/${taskId}`, "GET");
}

async function getTaskRelevantInfo(taskId) {
    return await this.sendRequest(`/tasks/info/${taskId}`, "GET");
}

async function runTask(taskId) {
    return await this.sendRequest(`/tasks/${taskId}`, "POST", {});
}
async function runAllDocumentTasks(spaceId, documentId) {
    return await this.sendRequest(`/tasks/run-all/${spaceId}/${documentId}`, "POST", {});
}
async function cancelAllDocumentTasks(spaceId, documentId) {
    return await this.sendRequest(`/tasks/cancel-all/${spaceId}/${documentId}`, "DELETE");
}
module.exports = {
    request,
    notificationService,
    fillTemplate,
    createSSEConnection,
    closeSSEConnection,
    subscribeToObject,
    unsubscribeFromObject,
    findCommands,
    arrayBufferToBase64,
    areCommandsDifferent,
    getCommandsDifferences,
    buildCommandString,
    buildCommandsString,
    cancelTask,
    getTasks,
    runTask,
    runAllDocumentTasks,
    cancelAllDocumentTasks,
    getTaskRelevantInfo,
    cancelTaskAndRemove,
    sendRequest,
    getTask,
    removeTask,
    sanitize,
    getSortedCommandsArray,
    unsanitize,
    constants
}
