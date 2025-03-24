const {request} = require("../util");
async function sendRequest(url, method, data, headers) {
    return await request(url, method, data, this.__securityContext, headers);
}

async function loadUser(email) {
    let userInfo = await this.sendRequest(`/auth/getInfo?email=${encodeURIComponent(email)}`, "GET");
    return {
        email: email,
        currentSpaceId: userInfo.currentSpaceId,
        spaces: userInfo.spaces,
        imageId: userInfo.imageId
    }
}

async function deleteAPIKey(spaceId, type) {
    return await this.sendRequest(`/spaces/${spaceId}/secrets/keys/${type}`, "DELETE");
}

async function editAPIKey(apiKeyObj) {
    return await this.sendRequest(`/spaces/secrets/keys`, "POST", apiKeyObj);
}
async function getUserProfileImage(email) {
    email = encodeURIComponent(email);
    let userInfo = await this.sendRequest(`/auth/getInfo?email=${email}`, "GET");
    let spaceModule = require("assistos").loadModule("space", this.__securityContext);
    return await spaceModule.getImage(userInfo.imageId);
}
async function updateUserImage(email, imageId) {
    email = encodeURIComponent(email);
    let userInfo = await this.sendRequest(`/auth/getInfo?email=${email}`, "GET");
    userInfo.imageId = imageId;
    return await this.sendRequest(`/auth/setInfo?email=${email}`, "PUT", userInfo);
}
async function getCurrentSpaceId(email) {
    email = encodeURIComponent(email);
    let userInfo = await this.sendRequest(`/auth/getInfo?email=${email}`, "GET");
    return userInfo.currentSpaceId;
}
async function logoutUser(){
    return await this.sendRequest(`/auth/walletLogout`, "POST");
}
async function userExists(email){
    email = encodeURIComponent(email);
    return await this.sendRequest(`/auth/userExists/${email}`, "GET");
}
async function loginUser(email, code){
    return await this.sendRequest(`/auth/walletLogin`, "POST", {email, code});
}
async function generateAuthCode(email, refererId){
    return await this.sendRequest(`/auth/generateAuthCode`, "POST", {email, refererId});
}
module.exports = {
    loadUser,
    editAPIKey,
    deleteAPIKey,
    sendRequest,
    getUserProfileImage,
    updateUserImage,
    logoutUser,
    userExists,
    loginUser,
    generateAuthCode,
    getCurrentSpaceId
}
