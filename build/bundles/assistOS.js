assistOSRequire=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"/home/mircea/Desktop/assistOS/apihub-components/spaces-storage/templates/defaultApiKeyTemplate.json":[function(require,module,exports){
module.exports={
  "type": "$$keyType",
  "ownerId": "$$ownerId",
  "id": "$$keyId",
  "value": "$$keyValue"
}

},{}],"/home/mircea/Desktop/assistOS/apihub-components/spaces-storage/templates/defaultSpaceAnnouncement.json":[function(require,module,exports){
module.exports={
  "id": "$$announcementId",
  "title": "Welcome to AssistOS!",
  "text": "Space $$spaceName was successfully created. You can now add documents, users and settings to your space.",
  "date": "$$currentUTCDate"
}
},{}],"/home/mircea/Desktop/assistOS/apihub-components/spaces-storage/templates/defaultSpaceNameTemplate.json":[function(require,module,exports){
module.exports="$$username Space"

},{}],"/home/mircea/Desktop/assistOS/apihub-components/spaces-storage/templates/defaultSpaceTemplate.json":[function(require,module,exports){
module.exports={
  "name": "$$spaceName",
  "id": "$$spaceId",
  "creationDate": "$$creationDate",
  "settings": {},
  "announcements": ["$$defaultAnnouncement"],
  "users": ["$$adminId"],
  "admins":["$$adminId"],
  "apiKeys": ["$$apiKey?"],
  "flows": [],
  "pages": [],
  "tasks": [],
  "conversationHistory": [],
  "documents": [],
  "context": [],
  "wordCount": 0,
  "installedApplications": [],
  "personalities": [],
  "currentPersonalityId": ""
}
},{}],"/home/mircea/Desktop/assistOS/apihub-components/spaces-storage/templates/spaceValidationSchema.json":[function(require,module,exports){
module.exports={
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "id": {
      "type": [
        "string",
        "number"
      ]
    },
    "creationDate": {
      "type": "string"
    },
    "settings": {
      "type": "object"
    },
    "announcements": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "users": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "admins": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "apiKeys": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "flows": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "pages": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "tasks": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "conversationHistory": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "documents": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "context": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "wordCount": {
      "type": "number"
    },
    "installedApplications": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "agent": {
      "type": "object"
    },
    "personalities": {
      "type": "array",
      "items": {
        "type": "object"
      }
    },
    "observers": {
      "type": "array",
      "items": {
        "type": "object"
      }
    }
  },
  "required": [
    "name",
    "id",
    "creationDate",
    "personalities",
    "settings",
    "announcements",
    "users",
    "documents",
    "apiKeys",
    "pages",
    "installedApplications"
  ]
}

},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/builds/tmp/assistOS_intermediar.js":[function(require,module,exports){
(function (global){(function (){
global.assistOSLoadModules = function(){ 

	if(typeof $$.__runtimeModules["assistos-sdk"] === "undefined"){
		$$.__runtimeModules["assistos-sdk"] = require("assistos-sdk");
	}

	if(typeof $$.__runtimeModules["assistos-sdk/modules/document"] === "undefined"){
		$$.__runtimeModules["assistos-sdk/modules/document"] = require("assistos-sdk/modules/document");
	}

	if(typeof $$.__runtimeModules["assistos-sdk/modules/space"] === "undefined"){
		$$.__runtimeModules["assistos-sdk/modules/space"] = require("assistos-sdk/modules/space");
	}

	if(typeof $$.__runtimeModules["assistos-sdk/modules/user"] === "undefined"){
		$$.__runtimeModules["assistos-sdk/modules/user"] = require("assistos-sdk/modules/user");
	}
};
if (true) {
	assistOSLoadModules();
}
global.assistOSRequire = require;
if (typeof $$ !== "undefined") {
	$$.requireBundle("assistOS");
}

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"assistos-sdk":"assistos-sdk","assistos-sdk/modules/document":"assistos-sdk/modules/document","assistos-sdk/modules/space":"assistos-sdk/modules/space","assistos-sdk/modules/user":"assistos-sdk/modules/user"}],"/home/mircea/Desktop/assistOS/assistos-sdk/constants.js":[function(require,module,exports){
module.exports = {
    DEFAULT_ID_LENGTH: 16
}
},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/document/apis/chapter.js":[function(require,module,exports){
async function sendRequest(url, method, data){
    let result;
    let init = {
        method: method
    };
    if(method === "POST" || method === "PUT"){
        init.body = typeof data === "string" ? data : JSON.stringify(data);
        init.headers = {
            "Content-type": "application/json; charset=UTF-8"
        };
    }
    try {
        result = await fetch(url,init);
    } catch (err) {
        console.error(err);
    }
    return await result.text();
}
const documentType = "documents";
const chapterType = "chapters";
function getObjectId(objectType, objectId){
    return `${objectType}_${objectId}`;
}
async function getChapter(spaceId, documentId, chapterId){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}
async function addChapter(spaceId, documentId, chapterData){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${chapterType}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "POST", chapterData);
}
async function updateChapter(spaceId, documentId, chapterData){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterData.id)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", chapterData);
}
async function deleteChapter(spaceId, documentId, chapterId){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "DELETE");
}

async function swapChapters(spaceId, documentId, chapterId1, chapterId2){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${chapterType}`);
    let body = {
        item1: chapterId1,
        item2: chapterId2
    }
    return await sendRequest(`/spaces/embeddedObject/swap/${spaceId}/${objectURI}`, "PUT", body);
}
async function updateChapterTitle(spaceId, documentId, chapterId, title) {
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}/title`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", title);
}

async function updateChapterMainIdeas(spaceId, documentId, chapterId, mainIdeas){
    //mainIdeas is an array of strings
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}/mainIdeas`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", mainIdeas);
}
async function updateChapterAlternativeTitles(spaceId, documentId, chapterId, alternativeTitles){
    //alternativeTitles is an array of strings
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}/alternativeTitles`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", alternativeTitles);
}

async function getAlternativeChapter(spaceId, documentId, alternativeChapterId){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId("alternativeChapters", alternativeChapterId)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}
async function addAlternativeChapter(spaceId, documentId, chapterId, alternativeChapter){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}/alternativeChapters`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "POST", alternativeChapter);
}
async function updateAlternativeChapter(spaceId, documentId, alternativeChapter){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId("alternativeChapters", alternativeChapter.id)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", alternativeChapter);
}
async function deleteAlternativeChapter(spaceId, documentId, chapterId, alternativeChapterId){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}/${getObjectId("alternativeChapters", alternativeChapterId)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "DELETE");
}
module.exports = {
    addChapter,
    updateChapter,
    deleteChapter,
    swapChapters,
    updateChapterTitle,
    updateChapterMainIdeas,
    updateChapterAlternativeTitles,
    getAlternativeChapter,
    addAlternativeChapter,
    updateAlternativeChapter,
    deleteAlternativeChapter
}
},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/document/apis/document.js":[function(require,module,exports){
async function sendRequest(url, method, data){
    let result;
    let init = {
        method: method
    };
    if(method === "POST" || method === "PUT"){
        init.body = typeof data === "string" ? data : JSON.stringify(data);
        init.headers = {
            "Content-type": "application/json; charset=UTF-8"
        };
    }
    try {
        result = await fetch(url,init);
    } catch (err) {
        console.error(err);
    }
    return await result.text();
}
const documentType = "documents";
function getObjectId(objectType, objectId){
    return `${objectType}_${objectId}`;
}
async function getDocument(spaceId, documentId){
    return await sendRequest(`/spaces/containerObject/${spaceId}/${getObjectId(documentType, documentId)}`, "GET");
}
async function addDocument(spaceId, documentData){
    return await sendRequest(`/spaces/containerObject/${spaceId}/${documentType}`, "POST", documentData);
}
async function updateDocument(spaceId, documentId, documentData){
    return await sendRequest(`/spaces/containerObject/${spaceId}/${getObjectId(documentType, documentId)}`, "PUT", documentData);
}
async function deleteDocument(spaceId, documentId){
    return await sendRequest(`/spaces/containerObject/${spaceId}/${getObjectId(documentType, documentId)}`, "DELETE");
}
async function updateDocumentTitle(spaceId, documentId, title) {
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/title`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", title);
}
async function updateDocumentTopic(spaceId, documentId, topic) {
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/topic`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", topic);
}
async function updateDocumentAbstract(spaceId, documentId, abstract) {
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/abstract`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", abstract);
}

async function updateDocumentMainIdeas(spaceId, documentId, mainIdeas){
    //mainIdeas is an array of strings
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/mainIdeas`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", mainIdeas);
}

async function updateAlternativeTitles(spaceId, documentId, alternativeTitles){
    //alternativeTitles is an array of strings
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/alternativeTitles`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", alternativeTitles);
}
async function updateAlternativeAbstracts(spaceId, documentId, alternativeAbstracts){
    //alternativeAbstracts is an array of strings
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/updateAlternativeAbstracts`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", alternativeAbstracts);
}

module.exports = {
    getDocument,
    addDocument,
    updateDocument,
    deleteDocument,
    updateDocumentTitle,
    updateDocumentTopic,
    updateDocumentAbstract,
    updateDocumentMainIdeas,
    updateAlternativeTitles,
    updateAlternativeAbstracts
};
},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/document/apis/paragraph.js":[function(require,module,exports){
async function sendRequest(url, method, data){
    let result;
    let init = {
        method: method
    };
    if(method === "POST" || method === "PUT"){
        init.body = typeof data === "string" ? data : JSON.stringify(data);
        init.headers = {
            "Content-type": "application/json; charset=UTF-8"
        };
    }
    try {
        result = await fetch(url,init);
    } catch (err) {
        console.error(err);
    }
    return await result.text();
}
const documentType = "documents";
const chapterType = "chapters";
const paragraphType = "paragraphs";
function getObjectId(objectType, objectId){
    return `${objectType}_${objectId}`;
}
async function getParagraph(spaceId, documentId, paragraphId){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(paragraphType, paragraphId)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}
async function addParagraph(spaceId, documentId, chapterId, paragraphData){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}/${paragraphType}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "POST", paragraphData);
}
async function updateParagraph(spaceId, documentId, chapterId, paragraphId, paragraphData){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(paragraphType, paragraphId)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", paragraphData);
}
async function deleteParagraph(spaceId, documentId, chapterId, paragraphId){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}/${getObjectId(paragraphType, paragraphId)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT");
}

async function swapParagraphs(spaceId, documentId, chapterId, paragraphId, paragraphId2){
    let body = {
        item1: paragraphId,
        item2: paragraphId2
    }
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}/paragraphs`);
    return await sendRequest(`/spaces/embeddedObject/swap/${spaceId}/${objectURI}`, "PUT", body);
}
async function updateParagraphText(spaceId, documentId, paragraphId, text) {
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(paragraphType, paragraphId)}/text`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", text);
}
async function updateParagraphMainIdea(spaceId, documentId, paragraphId, mainIdea) {
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(paragraphType, paragraphId)}/mainIdea`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", mainIdea);
}

async function getAlternativeParagraph(spaceId, documentId, alternativeParagraphId){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId("alternativeParagraphs", alternativeParagraphId)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "GET");
}
async function addAlternativeParagraph(spaceId, documentId, chapterId, paragraphId, alternativeParagraph){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}/${getObjectId(paragraphType, paragraphId)}/alternativeParagraphs`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "POST", alternativeParagraph);
}
async function updateAlternativeParagraph(spaceId, documentId, alternativeParagraphId, alternativeParagraph){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId("alternativeParagraphs", alternativeParagraph.id)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", alternativeParagraph);
}
async function deleteAlternativeParagraph(spaceId, documentId, chapterId, paragraphId, alternativeParagraphId){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId)}/${getObjectId(paragraphType, paragraphId)}/${getObjectId("alternativeParagraphs", alternativeParagraphId)}`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "DELETE");
}
module.exports = {
    addParagraph,
    updateParagraph,
    deleteParagraph,
    swapParagraphs,
    updateParagraphText,
    updateParagraphMainIdea,
    addAlternativeParagraph,
    updateAlternativeParagraph,
    deleteAlternativeParagraph
}
},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/document/data/templates/document.json":[function(require,module,exports){
module.exports={
  "id":"$$id",
  "title": "$$title",
  "topic": "$$topic?",
  "mainIdeas": [],
  "abstract": "",
  "alternativeTitles":[],
  "alternativeAbstracts":[],
  "chapters":[]
}
},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/space/apis/index.js":[function(require,module,exports){
//here needs to be http requests to the server
},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/user/apis/index.js":[function(require,module,exports){
arguments[4]["/home/mircea/Desktop/assistOS/assistos-sdk/modules/space/apis/index.js"][0].apply(exports,arguments)
},{}],"assistos-sdk/modules/document":[function(require,module,exports){
const apiModules={
    get document(){
        const module=require('./apis/document.js');
        Object.defineProperty(apiModules,'documentApis',{value:module,writable:false,configurable:true});
        return module;
    },
    get chapter(){
        const module=require('./apis/chapter.js');
        Object.defineProperty(apiModules,'chapterApis',{value:module,writable:false,configurable:true});
        return module;
    },
    get paragraph(){
        const module=require('./apis/paragraph.js');
        Object.defineProperty(apiModules,'paragraphApis',{value:module,writable:false,configurable:true});
        return module;
    }
}
const dataModules={
    templates:{
        get document(){
            const data=require('./data/templates/document.json');
            Object.defineProperty(dataModules,'documentTemplate',{value:data,writable:false,configurable:true});
            return data;
        }
    }
}
function loadAPIs(...apiNames) {
    if (apiNames.length === 0) {
        apiNames = Object.keys(apiModules);
    }
    if (apiNames.length === 1) {
        const api = apiModules[apiNames];
        if (!api) {
            throw new Error(`API '${apiNames}' not found`);
        }
        return api;
    }
    const selectedApis = {};
    for (const name of apiNames) {
        if (!apiModules[name]) {
            throw new Error(`API '${name}' not found`);
        }
        selectedApis[name] = apiModules[name];
    }
    return selectedApis;
}

function loadData(...dataTypes) {
    if (dataTypes.length === 0) {
        dataTypes = Object.keys(dataModules);
    }
    if (dataTypes.length === 1) {
        const data = dataModules[dataTypes[0]];
        if (!data) {
            throw new Error(`Data '${dataTypes[0]}' not found`);
        }
        return data;
    }
    const selectedData = {};
    for (const type of dataTypes) {
        if (!dataModules[type]) {
            throw new Error(`Data '${type}' not found`);
        }
        selectedData[type] = dataModules[type];
    }
    return selectedData;
}

module.exports = { loadAPIs, loadData };

},{"./apis/chapter.js":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/document/apis/chapter.js","./apis/document.js":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/document/apis/document.js","./apis/paragraph.js":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/document/apis/paragraph.js","./data/templates/document.json":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/document/data/templates/document.json"}],"assistos-sdk/modules/space":[function(require,module,exports){
const apiModules = {
    get space() {
        const module = require('./apis');
        Object.defineProperty(apiModules, 'space', {value: module, writable: false, configurable: true});
        return module;
    }
};
const dataModules = {
    templates: {
        get defaultApiKeyTemplate() {
            const data = require('../../../apihub-components/spaces-storage/templates/defaultApiKeyTemplate.json');
            Object.defineProperty(dataModules, 'defaultApiKeyTemplate', {
                value: data,
                writable: false,
                configurable: true
            });
            return data;
        },
        get defaultSpaceAnnouncement() {
            const data = require('../../../apihub-components/spaces-storage/templates/defaultSpaceAnnouncement.json');
            Object.defineProperty(dataModules, 'defaultSpaceAnnouncement', {
                value: data,
                writable: false,
                configurable: true
            });
            return data;
        },
        get defaultSpaceTemplate() {
            const data = require('../../../apihub-components/spaces-storage/templates/defaultSpaceTemplate.json');
            Object.defineProperty(dataModules, 'defaultSpaceTemplate', {
                value: data,
                writable: false,
                configurable: true
            });
            return data;
        },
        get defaultSpaceNameTemplate() {
            const data = require('../../../apihub-components/spaces-storage/templates/defaultSpaceNameTemplate.json');
            Object.defineProperty(dataModules, 'defaultSpaceNameTemplate', {
                value: data,
                writable: false,
                configurable: true
            });
            return data;
        },
        get spaceValidationSchema() {
            const data = require('../../../apihub-components/spaces-storage/templates/spaceValidationSchema.json');
            Object.defineProperty(dataModules, 'spaceValidationSchema', {
                value: data,
                writable: false,
                configurable: true
            });
            return data;
        }

    }
}

function loadAPIs(...apiNames) {
    if (apiNames.length === 0) {
        apiNames = Object.keys(apiModules);
    }
    if (apiNames.length === 1) {
        const api = apiModules[apiNames[0]];
        if (!api) {
            throw new Error(`API '${apiNames[0]}' not found`);
        }
        return api;
    }
    const selectedApis = {};
    for (const name of apiNames) {
        if (!apiModules[name]) {
            throw new Error(`API '${name}' not found`);
        }
        selectedApis[name] = apiModules[name];
    }
    return selectedApis;
}

function loadData(...dataTypes) {
    if (dataTypes.length === 0) {
        dataTypes = Object.keys(dataModules);
    }
    if (dataTypes.length === 1) {
        const data = dataModules[dataTypes[0]];
        if (!data) {
            throw new Error(`Data '${dataTypes[0]}' not found`);
        }
        return data;
    }
    const selectedData = {};
    for (const type of dataTypes) {
        if (!dataModules[type]) {
            throw new Error(`Data '${type}' not found`);
        }
        selectedData[type] = dataModules[type];
    }
    return selectedData;
}

module.exports = {loadAPIs, loadData};


},{"../../../apihub-components/spaces-storage/templates/defaultApiKeyTemplate.json":"/home/mircea/Desktop/assistOS/apihub-components/spaces-storage/templates/defaultApiKeyTemplate.json","../../../apihub-components/spaces-storage/templates/defaultSpaceAnnouncement.json":"/home/mircea/Desktop/assistOS/apihub-components/spaces-storage/templates/defaultSpaceAnnouncement.json","../../../apihub-components/spaces-storage/templates/defaultSpaceNameTemplate.json":"/home/mircea/Desktop/assistOS/apihub-components/spaces-storage/templates/defaultSpaceNameTemplate.json","../../../apihub-components/spaces-storage/templates/defaultSpaceTemplate.json":"/home/mircea/Desktop/assistOS/apihub-components/spaces-storage/templates/defaultSpaceTemplate.json","../../../apihub-components/spaces-storage/templates/spaceValidationSchema.json":"/home/mircea/Desktop/assistOS/apihub-components/spaces-storage/templates/spaceValidationSchema.json","./apis":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/space/apis/index.js"}],"assistos-sdk/modules/user":[function(require,module,exports){
const apiModules = {
    get user() {
        const module = require('./apis');
        Object.defineProperty(apiModules, 'userApis', { value: module, writable: false, configurable: true });
        return module;
    }
};

function loadAPIs(...apiNames) {
    if (apiNames.length === 0) {
        apiNames = Object.keys(apiModules);
    }
    if (apiNames.length === 1) {
        const api = apiModules[apiNames[0]];
        if (!api) {
            throw new Error(`API '${apiNames[0]}' not found`);
        }
        return api;
    }
    const selectedApis = {};
    for (const name of apiNames) {
        if (!apiModules[name]) {
            throw new Error(`API '${name}' not found`);
        }
        selectedApis[name] = apiModules[name];
    }
    return selectedApis;
}
module.exports = { loadAPIs };

},{"./apis":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/user/apis/index.js"}],"assistos-sdk":[function(require,module,exports){
module.exports = {
    loadModule: function(moduleName) {
        switch (moduleName) {
            case 'document':
                return require('./modules/document');
            case 'space':
                return require('./modules/space');
            case 'user':
                return require('./modules/user');
            default:
                return null;
        }
    },
    constants: require('./constants.js'),
};

},{"./constants.js":"/home/mircea/Desktop/assistOS/assistos-sdk/constants.js","./modules/document":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/document/index.js","./modules/space":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/space/index.js","./modules/user":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/user/index.js"}]},{},["/home/mircea/Desktop/assistOS/assistos-sdk/builds/tmp/assistOS_intermediar.js"])
                    ;(function(global) {
                        global.bundlePaths = {"assistOS":"build/bundles/assistOS.js"};
                    })(typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
                