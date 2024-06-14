const {request} = require("../util");

async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}
async function getGalleriesMetadata(spaceId) {
    return await this.sendRequest(`/spaces/containerObject/meta/${spaceId}/galleries`, "GET");
}

async function getGallery(spaceId, galleryId) {
    return await this.sendRequest(`/spaces/containerObject/${spaceId}/${galleryId}`, "GET");
}

async function addGallery(spaceId, galleryData) {
    galleryData.metadata = ["id", "name"];
    return await this.sendRequest(`/spaces/containerObject/${spaceId}/galleries`, "POST", galleryData);
}

async function updateGalleryName(spaceId, galleryId, galleryName) {
    let objectURI = encodeURIComponent(`${galleryId}/name`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", galleryName);
}

async function deleteGallery(spaceId, galleryId) {
    return await this.sendRequest(`/spaces/containerObject/${spaceId}/${galleryId}`, "DELETE");
}

async function addImage(spaceId, galleryId, imageData) {
    let objectURI = encodeURIComponent(`${galleryId}/images`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "POST", imageData);
}
async function getImage(spaceId, galleryId, imageId){
    let objectURI = encodeURIComponent(`${galleryId}/${imageId}`);
    return await this.sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}
module.exports = {
    sendRequest,
    getGalleriesMetadata,
    getGallery,
    addGallery,
    updateGalleryName,
    deleteGallery,
    addImage,
    getImage
}