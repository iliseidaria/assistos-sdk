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
    return await this.sendRequest(`/auth/logout`, "POST");
}

async function userExists(email){
    email = encodeURIComponent(email);
    return await this.sendRequest(`/auth/userExists/${email}`, "GET");
}

async function emailLogin(email, code) {
    return await this.sendRequest(`/auth/loginWithEmailCode`, 'POST', { email, code });
}

async function passkeyLogin(email, assertion, challengeKey) {
    return await this.sendRequest(`/auth/loginWithPasskey`, 'POST', { email, assertion, challengeKey });
}

async function totpLogin(email, code) {
    return await this.sendRequest(`/auth/loginWithTotp`, 'POST', { email, token: code });
}

async function generateAuthCode(email, name, refererId){
    return await this.sendRequest(`/auth/sendCodeByEmail`, "POST", {email, name, refererId});
}

async function setupTotp() {
    return await this.sendRequest(`/auth/setupTotp`, 'POST');
}

async function enableTotp(token, email) {
    return await this.sendRequest(`/auth/enableTotp`, 'POST', {
        token,
        email
    });
}

async function getAuthTypes(email) {
    return await this.sendRequest(`/auth/getAuthTypes/${encodeURIComponent(email)}`, 'GET');
}

async function generatePasskeySetupOptions() {
    return await this.sendRequest(`/auth/generatePasskeySetupOptions`, 'POST');
}

async function addPasskey(registrationData, challengeKey) {
    return await this.sendRequest(`/auth/addPasskey`, 'POST', {
        registrationData,
        challengeKey
    });
}

async function deletePasskey(email, credentialId) {
    return await this.sendRequest(`/auth/deletePasskey/${encodeURIComponent(email)}/${encodeURIComponent(credentialId)}`, 'DELETE');
}

async function deleteTotp(email) {
    return await this.sendRequest(`/auth/deleteTotp/${encodeURIComponent(email)}`, 'DELETE');
}

module.exports = {
    loadUser,
    sendRequest,
    getUserProfileImage,
    updateUserImage,
    logoutUser,
    userExists,
    emailLogin,
    passkeyLogin,
    totpLogin,
    generateAuthCode,
    getCurrentSpaceId,
    listUserSpaces,
    setupTotp,
    enableTotp,
    getAuthTypes,
    generatePasskeySetupOptions,
    addPasskey,
    deletePasskey,
    deleteTotp
}