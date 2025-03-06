const {request} = require("../util");
async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}

async function loadUser() {
    return await this.sendRequest(`/users`, "GET");
}

async function deleteAPIKey(spaceId, type) {
    return await this.sendRequest(`/spaces/${spaceId}/secrets/keys/${type}`, "DELETE",);
}

async function editAPIKey(apiKeyObj) {
    return await this.sendRequest(`/spaces/secrets/keys`, "POST", apiKeyObj);
}
async function getUserProfileImage(email) {
    return await this.sendRequest(`/users/profileImage/${email}`, "GET");
}
async function updateUserImage(email, imageId) {
    return await this.sendRequest(`/users/profileImage/${email}`, "POST", {imageId});
}
async function logoutUser(){
    let response = await fetch(`/auth/walletLogout`, {
        method: 'POST'
    });
    return response.ok;
}
async function accountExists(email){
    email = encodeURIComponent(email);
    let response = await fetch(`/auth/accountExists/${email}`);
    return await response.json();
}
async function loginUser(email, code, createSpace){
    let response = await fetch(`/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, code, createSpace})
    });
    return await response.json();
}
async function generateAuthCode(email, refererId){
    let response = await fetch(`/auth/generateAuthCode`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, refererId})
    });
    return await response.json();
}
module.exports = {
    loadUser,
    editAPIKey,
    deleteAPIKey,
    sendRequest,
    getUserProfileImage,
    updateUserImage,
    logoutUser,
    accountExists,
    loginUser,
    generateAuthCode
}
