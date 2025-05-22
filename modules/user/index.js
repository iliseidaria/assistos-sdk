const {request} = require("../util");
async function sendRequest(url, method, data, headers) {
    return await request(url, method, data, this.__securityContext, headers);
}

async function loadUser(email) {
    let url = "/auth/getInfo"
    if(email){
        url += `?email=${encodeURIComponent(email)}`;
    }
    let userInfo = await this.sendRequest(url, "GET");
    return {
        email: email,
        currentSpaceId: userInfo.currentSpaceId,
        spaces: userInfo.spaces,
        imageId: userInfo.imageId
    }
}

async function listUserSpaces(email) {
    let url = "/spaces/listSpaces"
    if(email){
        url += `?email=${encodeURIComponent(email)}`;
    }
    return await this.sendRequest(url, "GET");
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
async function walletLogin(email, code, loginMethod, challengeKey) {
    return await this.sendRequest(`/auth/walletLogin`, 'POST', {
        email,
        loginMethod: loginMethod || "emailCode",
        code: loginMethod !== "passkey" ? code : undefined,
        assertion: loginMethod === "passkey" ? code : undefined,
        challengeKey: loginMethod === "passkey" ? challengeKey : undefined
    });
}
async function generateAuthCode(email, refererId, authType, registrationData){
    return await this.sendRequest(`/auth/generateAuthCode`, "POST", {email, refererId, authType, registrationData});
}
async function verifyTotp(token, email, enableTotp) {
    return await this.sendRequest(`/auth/verifyTotp`, 'POST', {
        token,
        email,
        enableTotp
    });
}
async function getAuthTypes(email) {
    return await this.sendRequest(`/auth/getAuthTypes/${encodeURIComponent(email)}`, 'GET');
}
async function getPassKeyConfig() {
    return await this.sendRequest(`/auth/passKeyConfig`, 'GET');
}
async function registerTotp() {
    return await this.sendRequest(`/auth/registerTotp`, 'POST');
}
module.exports = {
    loadUser,
    sendRequest,
    getUserProfileImage,
    updateUserImage,
    logoutUser,
    userExists,
    walletLogin,
    generateAuthCode,
    getCurrentSpaceId,
    listUserSpaces,
    verifyTotp,
    getAuthTypes,
    getPassKeyConfig,
    registerTotp
}
