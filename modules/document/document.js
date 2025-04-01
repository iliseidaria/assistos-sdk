const request = require("../util").request;
const envType = require("assistos").envType;
const Document = require("./models/Document");
const constants = require("../../constants");
const {getAPIClient} = require("../util/utils");

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
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    let document = await client.getDocument(documentId);
    return new Document(document);
}

async function getDocumentsMetadata(spaceId) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.getAllDocumentObjects();
}

async function addDocument(spaceId, documentData) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    await client.createDocument(documentData);
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
            init.headers = { Cookie: this.__securityContext.cookies };
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

async function deleteDocument(spaceId, documentId) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    await client.deleteDocument(documentId);
}

async function updateDocument(spaceId, documentId, title, category, infoText, commands, comments, chapters, data) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    await client.updateDocument(documentId, title, category, infoText, commands, comments, chapters, data);
}

async function estimateDocumentVideoLength(spaceId, documentId) {
    let client = await getAPIClient("*", constants.SPACE_INSTANCE_PLUGIN, spaceId);
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
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    //TODO remake logic
    return await this.sendRequest(`documents/snapshots/${spaceId}/${documentId}/${snapshotId}`, "GET");
}

async function getDocumentSnapshots(spaceId, documentId) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.getDocumentSnapshots(documentId);
}

async function addDocumentSnapshot(spaceId, documentId) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.snapshot(documentId);
}

async function deleteDocumentSnapshot(spaceId, documentId, snapshotId) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.deleteSnapshot(documentId, snapshotId);
}

async function restoreDocumentSnapshot(spaceId, documentId, snapshotId) {
    let client = await getAPIClient("*", constants.WORKSPACE_PLUGIN, spaceId);
    return await client.restore(documentId, snapshotId);
}

module.exports = {
    getDocumentsMetadata,
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
    convertDocument
};
