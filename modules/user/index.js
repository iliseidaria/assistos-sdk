const crypto = require('opendsu').loadAPI('crypto');
const {request} = require("../util");
async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}
const prepareSecret = (secret) => {
    return Array.from(crypto.sha256JOSE(secret))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function registerUser(name, email, password, photo, inviteToken) {
    const headers = {
        "Content-Type": "application/json; charset=UTF-8",
    };
    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            name: name,
            email: email,
            password: prepareSecret(password),
            inviteToken: inviteToken,
            ...(photo ? { photo: photo } : {})
        })
    };
    const response = await fetch(`/users`, options);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${response.message}`);
    }

    return await response.json();
}

async function activateUser(activationToken) {
    const headers = {
        "Content-Type": "application/json; charset=UTF-8",
    };
    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            activationToken: activationToken
        })
    };
    const response = await fetch(`/users/verify`, options);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${response.message}`);
    }

    return await response.json();
}

async function loginUser(email, password) {
    const headers = {
        "Content-Type": "application/json; charset=UTF-8",
    };
    const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
            email: email,
            password: prepareSecret(password)
        })
    };
    const response = await fetch(`/users/login`, options);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${response.message}`);
    }

    return await response.json();
}

async function loadUser() {
    return await this.sendRequest(`/users`, "GET");
}

async function logoutUser() {
    return await this.sendRequest(`/users/logout`, "POST");
}

async function addGITCredentials(spaceId, username, token) {
    let body = {
        secretName: "gitCredentials",
        secret: {
            username: username,
            token: token
        }
    }
    return await this.sendRequest(`/users/secrets/${spaceId}`, "POST", body);
}
async function deleteGITCredentials(spaceId) {
    let body = {
        secretName: "gitCredentials"
    }
    return await this.sendRequest(`/users/secrets/${spaceId}`, "PUT", body);
}
async function userGITCredentialsExist(spaceId) {
    let body = {
        secretName: "gitCredentials"
    }
    return await this.sendRequest(`/users/secrets/exists/${spaceId}`, "POST", body);
}

async function deleteAPIKey(spaceId, type) {
    return await this.sendRequest(`/spaces/secrets/keys/${type}`, "DELETE", {
        spaceId: spaceId
    });
}

async function editAPIKey(apiKeyObj) {
    return await this.sendRequest(`/spaces/secrets/keys`, "POST", apiKeyObj);
}

module.exports = {
    registerUser,
    activateUser,
    loginUser,
    loadUser,
    logoutUser,
    userGITCredentialsExist,
    addGITCredentials,
    deleteGITCredentials,
    editAPIKey,
    deleteAPIKey,
    sendRequest
}
