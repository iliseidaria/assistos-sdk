const request = require("../util").request;
const envType = require("assistos").envType;
const Document = require("./models/Document");
const constants = require("../../constants");
const {getAPIClient} = require("../util/utils");
async function getClient(pluginName, spaceId) {
    return await getAPIClient(this.__securityContext.userId, pluginName, spaceId, {
        email: this.__securityContext.email
    })
}

async function sendRequest(url, method, data) {
    return await request(url, method, data, this.__securityContext);
}

async function exportDocument(spaceId, documentId, exportType) {
    return await this.sendRequest(`/documents/export/${spaceId}/${documentId}`, "POST", {exportType});
}

async function exportDocumentAsDocx(spaceId, documentId) {
    return await this.sendRequest(`/documents/export/docx/${spaceId}/${documentId}`, "POST");
}

async function importDocument(spaceId, documentFormData) {
    return await this.sendRequest(`/documents/import/${spaceId}`, "POST", documentFormData);
}

async function getDocument(spaceId, documentId) {
    let client = await this.getClient(constants.DOCUMENTS_PLUGIN, spaceId);
    return await client.getDocument(documentId);
}

async function loadDocument(spaceId, documentId) {
    let client = await this.getClient(constants.DOCUMENTS_PLUGIN, spaceId);
    let document = await client.dumpDocument(documentId);
    return new Document(document);
}

async function getDocuments(spaceId) {
    let client = await this.getClient(constants.DOCUMENTS_PLUGIN, spaceId);
    return await client.getAllDocumentObjects();
}

async function addDocument(spaceId, title, category) {
    function createDocId(title){
        return title.replace(/[^a-zA-Z0-9_]/g, "_");
    }
    let client = await this.getClient(constants.DOCUMENTS_PLUGIN, spaceId);
    let docId = createDocId(title);
    return await client.createDocument(docId, category, title);
}

async function convertDocument(formData) {
    try {
        const init = {
            method: 'POST',
            body: formData
        };

        // Use server proxy endpoint instead of direct docs converter URL
        let url = '/documents/convert';

        if (envType === constants.ENV_TYPE.NODE) {
            url = `${constants[constants.ENVIRONMENT_MODE]}${url}`;
            init.headers = {Cookie: this.__securityContext.cookies};
        }

        const response = await fetch(url, init);

        if (!response.ok) {
            const errorText = await response.text();
            let errorDetails = errorText;
            try {
                errorDetails = JSON.parse(errorText);
            } catch (e) {
                // Not JSON, keep as text
            }

            throw new Error(`HTTP error! status: ${response.status}, details: ${typeof errorDetails === 'object' ? JSON.stringify(errorDetails) : errorDetails}`);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}

async function uploadDoc(spaceId, docData) {
    return await this.sendRequest(`/documents/upload/${spaceId}`, "PUT", docData);
}

async function deleteDocument(spaceId, documentId) {
    let client = await this.getClient(constants.DOCUMENTS_PLUGIN, spaceId);
    await client.deleteDocument(documentId);
}

async function updateDocument(spaceId, documentId, title, docId, category, infoText, commands, comments, additionalData) {
    let client = await this.getClient(constants.DOCUMENTS_PLUGIN, spaceId);
    await client.updateDocument(documentId, title, docId, category, infoText, commands, comments, additionalData);
}

async function estimateDocumentVideoLength(spaceId, documentId) {
    let client = await this.getClient(constants.WORKSPACE_PLUGIN, spaceId);
    return await client.estimateDocumentVideoLength(documentId);
}

async function documentToVideo(spaceId, documentId) {
    return await this.sendRequest(`/tasks/video/${spaceId}/${documentId}`, "POST", {});
}

async function getDocumentTasks(spaceId, documentId) {
    return await this.sendRequest(`/tasks/${spaceId}/${documentId}`, "GET");
}

async function deselectDocumentItem(spaceId, documentId, itemId, selectId) {
    return await this.sendRequest(`/documents/select/${spaceId}/${documentId}/${itemId}/${selectId}`, "DELETE");
}

async function getSelectedDocumentItems(spaceId, documentId) {
    return await this.sendRequest(`/documents/select/${spaceId}/${documentId}`, "GET");
}

async function selectDocumentItem(spaceId, documentId, itemId, itemData) {
    return await this.sendRequest(`/documents/select/${spaceId}/${documentId}/${itemId}`, "PUT", itemData);
}

async function translateDocument(spaceId, documentId, language, personalityId) {
    return await this.sendRequest(`/tasks/translate/${spaceId}/${documentId}`, "POST", {language, personalityId});
}

async function undoOperation(spaceId, documentId) {
    return await this.sendRequest(`/documents/undo/${spaceId}/${documentId}`, "PUT");
}

async function redoOperation(spaceId, documentId) {
    return await this.sendRequest(`/documents/redo/${spaceId}/${documentId}`, "PUT");
}

async function getDocumentSnapshot(spaceId, documentId, snapshotId) {
    let client = await this.getClient(constants.DOCUMENTS_PLUGIN, spaceId);
    //TODO remake logic
    return await this.sendRequest(`documents/snapshots/${spaceId}/${documentId}/${snapshotId}`, "GET");
}

async function getDocumentSnapshots(spaceId, documentId) {
    let client = await this.getClient(constants.DOCUMENTS_PLUGIN, spaceId);
    return await client.getDocumentSnapshots(documentId);
}

async function addDocumentSnapshot(spaceId, documentId) {
    let client = await this.getClient(constants.DOCUMENTS_PLUGIN, spaceId);
    return await client.snapshot(documentId);
}

async function deleteDocumentSnapshot(spaceId, documentId, snapshotId) {
    let client = await this.getClient(constants.DOCUMENTS_PLUGIN, spaceId);
    return await client.deleteSnapshot(documentId, snapshotId);
}

async function restoreDocumentSnapshot(spaceId, documentId, snapshotId) {
    let client = await this.getClient(constants.DOCUMENTS_PLUGIN, spaceId);
    return await client.restore(documentId, snapshotId);
}

async function getDocumentVariables(spaceId, documentId) {
    let client = await this.getClient(constants.WORKSPACE_PLUGIN, spaceId);
    return await client.getVariablesForDoc(documentId);
}

async function getVarValue(spaceId, documentId, varId) {
    let client = await this.getClient(constants.WORKSPACE_PLUGIN, spaceId);
    return await client.getVarValue(documentId, varId);
}

async function getStylePreferences(email) {
    let userInfo = await this.sendRequest(`/auth/getInfo?email=${email}`, "GET");
    return userInfo.stylePreferences || {};
}

async function getPrintPreferences(email) {
    let userInfo = await this.sendRequest(`/auth/getInfo?email=${email}`, "GET");
    return userInfo.printPreferences || {};
}

async function getExportPreferences(email) {
    let userInfo = await this.sendRequest(`/auth/getInfo?email=${email}`, "GET");
    return userInfo.exportPreferences || {};
}

async function updatePrintPreferences(email, printPreferences) {
    let userInfo = await this.sendRequest(`/auth/getInfo?email=${email}`, "GET");
    userInfo.printPreferences = printPreferences;
    return await this.sendRequest(`/auth/setInfo?email=${email}`, "PUT", userInfo);
}

async function updateExportPreferences(email, exportPreferences) {
    let userInfo = await this.sendRequest(`/auth/getInfo?email=${email}`, "GET");
    userInfo.exportPreferences = exportPreferences;
    return await this.sendRequest(`/auth/setInfo?email=${email}`, "PUT", userInfo);
}

async function updateDocumentPreferences(email, stylePreferences) {
    let userInfo = await this.sendRequest(`/auth/getInfo?email=${email}`, "GET");
    userInfo.stylePreferences = stylePreferences;
    return await this.sendRequest(`/auth/setInfo?email=${email}`, "PUT", userInfo);
}

module.exports = {
    getClient,
    getPrintPreferences,
    getStylePreferences,
    getExportPreferences,
    updatePrintPreferences,
    updateExportPreferences,
    updateDocumentPreferences,
    loadDocument,
    getDocuments,
    getDocument,
    addDocument,
    updateDocument,
    deleteDocument,
    sendRequest,
    documentToVideo,
    estimateDocumentVideoLength,
    getDocumentTasks,
    exportDocument,
    importDocument,
    deselectDocumentItem,
    getSelectedDocumentItems,
    selectDocumentItem,
    exportDocumentAsDocx,
    translateDocument,
    undoOperation,
    redoOperation,
    getDocumentSnapshot,
    getDocumentSnapshots,
    addDocumentSnapshot,
    deleteDocumentSnapshot,
    restoreDocumentSnapshot,
    convertDocument,
    uploadDoc,
    getDocumentVariables,
    getVarValue
};
