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
        } else if (data instanceof ArrayBuffer) {
            init.body = data;
            init.headers["Content-Type"] = "application/octet-stream";
        } else {
            init.body = JSON.stringify(data);
            init.headers["Content-Type"] = "application/json; charset=UTF-8";
        }
    }
    const assistOS = require("assistos");
    if (assistOS.envType === constants.ENV_TYPE.NODE) {
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
    if (contentType.includes('audio/')) {
        return await response.arrayBuffer();
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

function arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);

    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return btoa(binary);
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

function findCommands(input) {
    input = unescapeHTML(input);
    input = input.trim();

    const commandsArray = input.split(';').map(cmd => cmd.trim()).filter(cmd => cmd !== '');
    const result = {};

    let lastCommandIndex = -1;

    for (let commandStr of commandsArray) {
        const regex = /^(\w+)(\s+.*)?$/;
        const match = commandStr.match(regex);

        if (!match) {
            return { invalid: true, error: `Invalid command format: "${commandStr}"` };
        }

        let foundCommand = match[1];
        let paramsString = match[2] ? match[2].trim() : '';

        const commandConfig = constants.COMMANDS_CONFIG.COMMANDS.find(cmd => cmd.NAME === foundCommand);
        if (!commandConfig) {
            return { invalid: true, error: `Unknown command "${foundCommand}" in input: "${commandStr}"` };
        }

        // Check order of commands
        const commandIndex = constants.COMMANDS_CONFIG.ORDER.indexOf(foundCommand);
        if (commandIndex < lastCommandIndex) {
            return { invalid: true, error: `Command "${foundCommand}" is out of order in input: "${commandStr}"` };
        }
        lastCommandIndex = commandIndex;


        for (let previousCommand in result) {
            if (!commandConfig.ALLOWED_ALONG.includes(previousCommand) && !constants.COMMANDS_CONFIG.COMMANDS.find(cmd => cmd.NAME === previousCommand).ALLOWED_ALONG.includes(foundCommand)) {
                return { invalid: true, error: `Command "${foundCommand}" is not allowed alongside "${previousCommand}"` };
            }
        }

        if (result[foundCommand]) {
            return { invalid: true, error: `Duplicate command "${foundCommand}" detected in input: "${commandStr}"` };
        }

        const paramsObject = {};
        if (paramsString) {
            let paramsArray = paramsString.split(/\s+/);
            for (let param of paramsArray) {
                if (param.includes('=')) {
                    let [name, value] = param.split('=');
                    let parameter = commandConfig.PARAMETERS?.find(p => p.NAME === name);
                    if (!parameter) {
                        return { invalid: true, error: `Unknown parameter "${name}" in command: "${commandStr}"` };
                    }
                    if (parameter.TYPE === 'number') {
                        value = parseFloat(value);
                        if (isNaN(value) || value < parameter.MIN_VALUE || value > parameter.MAX_VALUE) {
                            return { invalid: true, error: `Invalid value for parameter "${name}" in command: "${commandStr}"` };
                        }
                    } else if (parameter.TYPE === 'string' && parameter.VALUES && !parameter.VALUES.includes(value)) {
                        return { invalid: true, error: `Invalid value "${value}" for parameter "${name}" in command: "${commandStr}"` };
                    }
                    paramsObject[name] = value;
                } else {
                    return { invalid: true, error: `Invalid parameter format "${param}" in command: "${commandStr}"` };
                }
            }
        }

        result[foundCommand] = {
            name: foundCommand,
            action: commandConfig.ACTION,
            paramsObject: paramsObject,
        };
    }
    return result;
}



function updateCommandsString(commandType, parameters, currentCommandsString) {
    const commands = findCommands(currentCommandsString);
    if(commands.invalid){
        throw new Error(commands.error);
    }
    commands[commandType] = {
        name: commandType,
        action: constants.COMMANDS_CONFIG.COMMANDS.find(command => command.NAME === `${commandType}`).ACTION,
        paramsObject: parameters
    };

    const updatedCommandsString = Object.entries(commands)
        .map(([key, command]) => buildCommandString(command.name, command.paramsObject))
        .join("\n");

    return updatedCommandsString;
}


function normalizeString(str) {
    if (!str) {
        return '';
    }
    return str.replace(/\s/g, ' '); // Replace all whitespace characters with a simple space
}

function isSameCommand(commandObj1, commandObj2) {
    let differences = [];

    if (normalizeString(commandObj1.action) !== normalizeString(commandObj2.action)) {
        differences.push(`Actions differ: ${commandObj1.action} vs ${commandObj2.action}`);
    }

    if (normalizeString(commandObj1.remainingText) !== normalizeString(commandObj2.remainingText)) {
        differences.push(`Remaining text differs: "${commandObj1.remainingText}" vs "${commandObj2.remainingText}"`);
    }

    const params1 = commandObj1.paramsObject || {};
    const params2 = commandObj2.paramsObject || {};
    const keys1 = Object.keys(params1);
    const keys2 = Object.keys(params2);

    if (keys1.length !== keys2.length) {
        differences.push(`Number of parameters differs: ${keys1.length} vs ${keys2.length}`);
    }

    for (let key of keys1) {
        if (normalizeString(params1[key]) !== normalizeString(params2[key])) {
            differences.push(`Parameter "${key}" values differ: ${params1[key]} vs ${params2[key]}`);
        }
    }

    for (let key of keys2) {
        if (!keys1.includes(key)) {
            differences.push(`Parameter "${key}" is missing in the first command object`);
        }
    }

    if (differences.length > 0) {
        return {isEqual: false, differences: differences};
    } else {
        return {isEqual: true, differences: []};
    }
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
    isSameCommand,
    buildCommandString,
    updateCommandsString
}
