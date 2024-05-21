const crypto = require('opendsu').loadAPI('crypto');
const {request} = require("../../util");
async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}
const prepareSecret = (secret) => {
    return Array.from(crypto.sha256JOSE(secret))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

async function registerUser(name, email, password, photo) {
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
    const response = await fetch(`/users`,
        {
            method: "GET"
        });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${response.message}`);
    }
    return (await response.json()).data;
}

async function logoutUser() {
    const response = await fetch(`/users/logout`,
        {
            method: "POST"
        });
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${response.message}`);
    }
    return (await response.json()).data;
}

async function storeUser(userId, jsonData) {
    let result = await fetch(`/users/${userId}`,
        {
            method: "PUT",
            body: jsonData,
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

    return await result.text();
}

async function addGITCredentials(spaceId, username, token) {
    let body = {
        secretName: "gitCredentials",
        secret: {
            username: username,
            token: token
        }
    }
    return await sendRequest(`/users/secrets/${spaceId}`, "POST", body);
}
async function deleteGITCredentials(spaceId) {
    let body = {
        secretName: "gitCredentials"
    }
    return await sendRequest(`/users/secrets/${spaceId}`, "PUT", body);
}
async function userGITCredentialsExist(spaceId) {
    let body = {
        secretName: "gitCredentials"
    }
    return await sendRequest(`/users/secrets/exists/${spaceId}`, "POST", body);
}

async function deleteAPIKey(keyId) {
    return await sendRequest(`/spaces/secrets/keys/${keyId}`, "DELETE");
}

async function addAPIKey(keyType, apiKey) {
    let body = {
        keyType: keyType,
        key: apiKey
    }
    return await sendRequest(`/spaces/secrets/keys`, "POST", body);
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
    addAPIKey,
    deleteAPIKey,
    sendRequest
}