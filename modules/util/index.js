const constants = require("../../constants.js");
const envType = require("assistos").envType;


async function request(url, method = "GET", data, securityContext, headers = {}, externalRequest) {
    let init = {
        method: method,
        headers: headers
    };
    if (method === "POST" || method === "PUT") {
        if (data instanceof FormData || typeof data === "function" || data instanceof ArrayBuffer || Buffer.isBuffer(data) || data instanceof Uint8Array) {
            /* let the browser decide the content type */
            init.body = data;
        } else if (typeof data === "string") {
            init.body = data;
            init.headers["Content-Type"] = "text/plain; charset=UTF-8";
        } else {
            init.body = JSON.stringify(data);
            init.headers["Content-Type"] = "application/json; charset=UTF-8";
        }
    }
    if (envType === constants.ENV_TYPE.NODE && !externalRequest) {
        url = `${constants[constants.ENVIRONMENT_MODE]}${url}`;
        init.headers.Cookie = securityContext.cookies;
        init.headers["x-api-key"] = process.env.SSO_SECRETS_ENCRYPTION_KEY;
    }
    let response;
    try {
        response = await fetch(url, init);
    } catch (err) {
        throw new Error(err.message);
    }

    const contentType = response.headers.get('Content-Type');
    if(!response.ok && !contentType){
       return;
    }
    if (contentType.includes('application/zip')) {
        return await response.blob();
    }
    if (contentType.includes('audio/') || contentType.includes('image/') || contentType.includes('video/') || contentType.includes('application/octet-stream')) {
        return await response.arrayBuffer();
    }
    if (method === "HEAD") {
        return response.ok;
    }
    if(contentType.includes('application/json')) {
        const responseJSON = await response.json();
        if (!response.ok) {
            let errorData = {
                status: response.status,
                message: responseJSON.message || response.statusText
            }
            throw new Error(JSON.stringify(errorData));
        }
        return responseJSON;
    }

    let textResponse = await response.text();
    if(!response.ok){
        throw new Error(textResponse);
    }
    return textResponse;
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
async function getTaskLogs(spaceId, taskId) {
    return await this.sendRequest(`/tasks/logs/${spaceId}/${taskId}`, "GET");
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
async function downloadLogsFile(spaceId) {
    return await this.sendRequest(`/logs/${spaceId}`, "GET");
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
    arrayBufferToBase64,
    cancelTask,
    getTasks,
    runTask,
    runAllDocumentTasks,
    cancelAllDocumentTasks,
    getTaskRelevantInfo,
    cancelTaskAndRemove,
    sendRequest,
    getTask,
    getTaskLogs,
    removeTask,
    downloadLogsFile,
    sanitize,
    unsanitize
}
