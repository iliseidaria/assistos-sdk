assistOSRequire=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"/home/axiologic/Desktop/assistos-workspace/apihub-components/apihub-component-utils/data.js":[function(require,module,exports){
function fillTemplate(templateObject, fillObject, depth = 0) {
    /* Todo: Implement a detection mechanism for circular dependencies instead of a hardcoded nested depth limit */

    if (depth > 10) {
        throw new Error("Depth Overreach. Possible Circular Dependency");
    }

    const containsPlaceholder = (templateObjectValueString) => {
        const placeholderPattern = /\$\$[a-zA-Z0-9_]+(\?)?/g;
        return placeholderPattern.test(templateObjectValueString);
    }

    if (typeof templateObject === 'string') {
        if (containsPlaceholder(templateObject)) {
            let resultString = "";
            let buffer = "";
            let placeholder = "";
            let i = 0;

            while (i < templateObject.length) {
                if (templateObject[i] === '$' && templateObject[i + 1] === '$') {
                    if (buffer.length > 0) {
                        resultString += buffer;
                        buffer = "";
                    }
                    i += 2;
                    while (i < templateObject.length &&
                    /[\w?]/.test(templateObject[i])) {
                        placeholder += templateObject[i];
                        i++;
                    }
                    const optionalPlaceholder = placeholder.endsWith('?');
                    const placeholderKey = optionalPlaceholder ? placeholder.slice(0, -1) : placeholder;
                    if (fillObject.hasOwnProperty(placeholderKey)) {
                        let placeholderValue = fillObject[placeholderKey];
                        let isFullReplacement = templateObject.trim() === `$$${placeholderKey}` || templateObject.trim() === `$$${placeholderKey}?`;

                        if (typeof placeholderValue === 'object') {
                            if (!Array.isArray(placeholderValue) && !isFullReplacement) {
                                resultString += JSON.stringify(placeholderValue);
                            } else if (Array.isArray(placeholderValue) && !isFullReplacement) {
                                resultString += JSON.stringify(placeholderValue);
                            } else {
                                return placeholderValue;
                            }
                        } else if (placeholderValue === undefined && optionalPlaceholder) {
                            resultString += "";
                        } else {
                            resultString += placeholderValue.toString();
                        }
                    } else if (!optionalPlaceholder) {
                        throw new Error(`Missing required fill data for "${placeholderKey}"`);
                    }
                    placeholder = "";
                } else {
                    buffer += templateObject[i];
                    i++;
                }
            }
            resultString += buffer;
            return resultString;
        } else {
            return templateObject;
        }
    } else if (Array.isArray(templateObject)) {
        return templateObject.reduce((acc, currentElement) => {
            const replacedElement = fillTemplate(currentElement, fillObject, depth + 1);
            if (replacedElement !== "") {
                acc.push(replacedElement);
            }
            return acc;
        }, []);

    } else if (typeof templateObject === 'object') {
        const newObj = {};
        for (const [key, value] of Object.entries(templateObject)) {
            newObj[key] = fillTemplate(value, fillObject, depth + 1);
        }
        return newObj;
    }else{
        return templateObject;
    }
}

function validateObject(schema, data) {
    function validateProperty(schema, data) {
        if (Array.isArray(schema.type)) {
            const typeValidationResult = validateTypeArray(schema.type, data);
            if (!typeValidationResult.status) return typeValidationResult;
        } else if (!matchesType(schema.type, data)) {
            return { status: false, errorMessage: `Type mismatch. Expected ${schema.type}.` };
        }

        if (schema.type === "object" && typeof data === 'object') {
            return validateObject(schema, data);
        } else if (schema.type === "array" && Array.isArray(data)) {
            for (let i = 0; i < data.length; i++) {
                const itemValidationResult = validateObject(schema.items, data[i]);
                if (!itemValidationResult.status) {
                    return { status: false, errorMessage: `At index ${i}: ${itemValidationResult.errorMessage}` };
                }
            }
        } else {
            return validateType(schema, data);
        }

        return { status: true };
    }

    function matchesType(type, data) {
        if (type === "array") return Array.isArray(data);
        if (type === "object") return typeof data === "object" && data !== null && !Array.isArray(data);
        if (type === "null") return data === null;
        return typeof data === type || (type === 'number' && typeof data === 'number');
    }

    function validateTypeArray(types, data) {
        for (const type of types) {
            if (matchesType(type, data)) {
                return { status: true };
            }
        }
        return { status: false, errorMessage: `Type mismatch. Expected one of: ${types.join(", ")}.` };
    }

    function validateType(prop, value) {
        if (prop.type === "string") {
            if (typeof value !== "string") return { status: false, errorMessage: "must be a string" };
            if (prop.minLength !== undefined && value.length < prop.minLength) return { status: false, errorMessage: `must have at least ${prop.minLength} characters` };
            if (prop.maxLength !== undefined && value.length > prop.maxLength) return { status: false, errorMessage: `must have no more than ${prop.maxLength} characters` };
            if (prop.pattern !== undefined && !new RegExp(prop.pattern).test(value)) return { status: false, errorMessage: "does not match the required format" };
        } else if (prop.type === "number") {
            if (typeof value !== "number" || isNaN(value)) return { status: false, errorMessage: "must be a number" };
            if (prop.minimum !== undefined && value < prop.minimum) return { status: false, errorMessage: `must be at least ${prop.minimum}` };
            if (prop.maximum !== undefined && value > prop.maximum) return { status: false, errorMessage: `must be no more than ${prop.maximum}` };
        } else if (prop.type === "boolean") {
            if (typeof value !== "boolean") return { status: false, errorMessage: "must be a boolean" };
        } else if (prop.type === "object") {
            if (typeof value !== "object" || Array.isArray(value) || value === null) return { status: false, errorMessage: "must be an object" };
        } else if (prop.type === "array") {
            if (!Array.isArray(value)) return { status: false, errorMessage: "must be an array" };
        }
        return { status: true };
    }

    if (!matchesType(schema.type, data)) {
        return { status: false, errorMessage: `Type mismatch. Expected ${schema.type}.` };
    }

    if (schema.required) {
        for (const property of schema.required) {
            if (data === undefined || !(property in data)) {
                return { status: false, errorMessage: `Missing required property: ${property}` };
            }
        }
    }

    if (typeof data === 'object' && data !== null) {
        for (const property in schema.properties) {
            if (data.hasOwnProperty(property)) {
                const propSchema = schema.properties[property];
                const propData = data[property];
                const validationResult = validateProperty(propSchema, propData);
                if (!validationResult.status) {
                    return { status: false, errorMessage: `In property '${property}': ${validationResult.errorMessage}` };
                }
            }
        }
    }

    return { status: true, errorMessage: "" };
}


module.exports={
    fillTemplate,
    validateObject
}
},{}],"/home/axiologic/Desktop/assistos-workspace/apihub-components/config.json":[function(require,module,exports){
module.exports={
  "ENVIRONMENT_MODE": "development",
  "PRODUCTION_BASE_URL": "http://demo.axiologic.net:8080",
  "DEVELOPMENT_BASE_URL": "http://localhost:8080",
  "SERVER_ROOT_FOLDER": "./apihub-root",
  "SECURITY_MODULE_PATH": "./apihub-space-core/securityModule.json",
  "STORAGE_VOLUME_PATH": "./data-volume",
  "CLEAN_STORAGE_VOLUME_ON_RESTART": "true",
  "CREATE_DEMO_USER": "true",
  "REGENERATE_TOKEN_SECRETS_ON_RESTART": "true"
}
},{}],"/home/axiologic/Desktop/assistos-workspace/apihub-components/email/api/index.js":[function(require,module,exports){
(function (__dirname){(function (){
const fsPromises = require('fs').promises;
const path = require('path');

const emailConfig = require('../emailConfig.json');

class Email {
    constructor() {
        const nodemailer = require('nodemailer');

        if (Email.instance) {
            return Email.instance;
        }
        this.transporter = nodemailer.createTransport({
            service: emailConfig.service,
            auth: {
                user: emailConfig.emailAuth,
                pass: emailConfig.password,
            },
        });
    }

    static getInstance() {
        if (!Email.instance) {
            Email.instance = new Email();
        }
        return Email.instance;
    }

    async sendEmail(from = emailConfig.email, sendToAddr, subject, html) {
        const mailOptions = {
            from: from,
            to: sendToAddr,
            subject: subject,
            html: html
        };
        await this.transporter.sendMail(mailOptions);
    }

    async sendActivationEmail(emailAddress, username, activationToken) {
        const data=require('../../apihub-component-utils/data.js')
        const activationEmailTemplatePath = path.join(__dirname, '..',  'templates','activationEmailTemplate.html');
        const {ENVIRONMENT_MODE, PRODUCTION_BASE_URL, DEVELOPMENT_BASE_URL} = require('../../config.json')

        const activationEmailTemplate = await fsPromises.readFile(activationEmailTemplatePath, 'utf8')
        let baseURL;

        if (ENVIRONMENT_MODE === 'development') {
            baseURL = DEVELOPMENT_BASE_URL
        } else {
            baseURL = PRODUCTION_BASE_URL
        }
        const activationLink = `${baseURL}/users/verify?activationToken=${encodeURIComponent(activationToken)}`;
        const emailHtml = data.fillTemplate(activationEmailTemplate, {
            username: username,
            companyLogoURL: emailConfig.companyLogoURL,
            activationLink: activationLink,
            companyName: emailConfig.companyName,
            streetAddress: emailConfig.streetAddress,
            city: emailConfig.city,
            country: emailConfig.country,
            zipCode: emailConfig.zipCode,
            supportEmail: emailConfig.supportEmail,
            phoneNumber: emailConfig.phoneNumber,
        });
        await this.sendEmail(emailConfig.email, emailAddress, 'Account Activation', emailHtml);
    }
}

module.exports = Email;

}).call(this)}).call(this,"/../apihub-components/email/api")

},{"../../apihub-component-utils/data.js":"/home/axiologic/Desktop/assistos-workspace/apihub-components/apihub-component-utils/data.js","../../config.json":"/home/axiologic/Desktop/assistos-workspace/apihub-components/config.json","../emailConfig.json":"/home/axiologic/Desktop/assistos-workspace/apihub-components/email/emailConfig.json","fs":false,"nodemailer":false,"path":false}],"/home/axiologic/Desktop/assistos-workspace/apihub-components/email/emailConfig.json":[function(require,module,exports){
module.exports={
  "service": "gmail",
  "emailAuth": "assistos.demo@gmail.com",
  "email": "AssistOS <assistos.demo@gmail.com>",
  "password": "eeqd azcd bfvf xuhm",
  "companyLogoURL": "https://i.ibb.co/GP2ccSh/logo.jpg",
  "companyName": "AssistOS",
  "phoneNumber": "+40 758 239 880",
  "supportEmail": "office@axiologic.net",
  "city": "Iasi",
  "country": "Romania",
  "streetAddress": "Costache Negri 62 B",
  "zipCode": "700070"
}
},{}],"/home/axiologic/Desktop/assistos-workspace/apihub-components/email/index.js":[function(require,module,exports){
(function (__dirname){(function (){
const fsPromises = require('fs').promises;
const path = require('path');
const service = require('./api');

// Template registry
const templateRegistry = {
    'activationFailTemplate': 'activationFailTemplate.html',
    'activationSuccessTemplate': 'activationSuccessTemplate.html',
    'activationEmailTemplate': 'activationEmailTemplate.html'
};

const getTemplate = async (templateName) => {
    const fileName = templateRegistry[templateName];
    if (!fileName) {
        throw new Error(`Template '${templateName}' does not exist.`);
    }
    const filePath = path.join(__dirname,'templates', fileName);
    return await fsPromises.readFile(filePath, 'utf8');
};


module.exports = {
    getTemplate,
    instance: service.getInstance()
};

}).call(this)}).call(this,"/../apihub-components/email")

},{"./api":"/home/axiologic/Desktop/assistos-workspace/apihub-components/email/api/index.js","fs":false,"path":false}],"/home/axiologic/Desktop/assistos-workspace/apihub-components/spaces-storage/templates/json/defaultApiKeyTemplate.json":[function(require,module,exports){
module.exports={
  "type": "$$keyType",
  "ownerId": "$$ownerId",
  "id": "$$keyId",
  "value": "$$keyValue"
}

},{}],"/home/axiologic/Desktop/assistos-workspace/apihub-components/spaces-storage/templates/json/defaultSpaceAnnouncement.json":[function(require,module,exports){
module.exports={
  "id": "$$announcementId",
  "title": "Welcome to AssistOS!",
  "text": "Space $$spaceName was successfully created. You can now add documents, users and settings to your space.",
  "date": "$$currentUTCDate"
}
},{}],"/home/axiologic/Desktop/assistos-workspace/apihub-components/spaces-storage/templates/json/defaultSpaceNameTemplate.json":[function(require,module,exports){
module.exports="$$username Space"

},{}],"/home/axiologic/Desktop/assistos-workspace/apihub-components/spaces-storage/templates/json/defaultSpaceTemplate.json":[function(require,module,exports){
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
},{}],"/home/axiologic/Desktop/assistos-workspace/apihub-components/spaces-storage/templates/json/spaceValidationSchema.json":[function(require,module,exports){
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

},{}],"/home/axiologic/Desktop/assistos-workspace/assistos-sdk/builds/tmp/assistOS_intermediar.js":[function(require,module,exports){
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

},{"assistos-sdk":"assistos-sdk","assistos-sdk/modules/document":"assistos-sdk/modules/document","assistos-sdk/modules/space":"assistos-sdk/modules/space","assistos-sdk/modules/user":"assistos-sdk/modules/user"}],"/home/axiologic/Desktop/assistos-workspace/assistos-sdk/constants.js":[function(require,module,exports){
module.exports = {
    DEFAULT_ID_LENGTH: 16
}
},{}],"/home/axiologic/Desktop/assistos-workspace/assistos-sdk/modules/document/apis/chapter.js":[function(require,module,exports){
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
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(chapterType, chapterId1)}/position`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", chapterId2);
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
},{}],"/home/axiologic/Desktop/assistos-workspace/assistos-sdk/modules/document/apis/document.js":[function(require,module,exports){
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
},{}],"/home/axiologic/Desktop/assistos-workspace/assistos-sdk/modules/document/apis/paragraph.js":[function(require,module,exports){
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

async function swapParagraphs(spaceId, documentId, paragraphId, paragraphId2){
    let objectURI = encodeURIComponent(`${getObjectId(documentType, documentId)}/${getObjectId(paragraphType, paragraphId)}/position`);
    return await sendRequest(`/spaces/embeddedObject/${spaceId}/${objectURI}`, "PUT", paragraphId2);
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
},{}],"/home/axiologic/Desktop/assistos-workspace/assistos-sdk/modules/document/data/templates/document.json":[function(require,module,exports){
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
},{}],"/home/axiologic/Desktop/assistos-workspace/assistos-sdk/modules/space/apis/index.js":[function(require,module,exports){
//here needs to be http requests to the server
},{}],"/home/axiologic/Desktop/assistos-workspace/assistos-sdk/modules/user/apis/index.js":[function(require,module,exports){
arguments[4]["/home/axiologic/Desktop/assistos-workspace/assistos-sdk/modules/space/apis/index.js"][0].apply(exports,arguments)
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

},{"./apis/chapter.js":"/home/axiologic/Desktop/assistos-workspace/assistos-sdk/modules/document/apis/chapter.js","./apis/document.js":"/home/axiologic/Desktop/assistos-workspace/assistos-sdk/modules/document/apis/document.js","./apis/paragraph.js":"/home/axiologic/Desktop/assistos-workspace/assistos-sdk/modules/document/apis/paragraph.js","./data/templates/document.json":"/home/axiologic/Desktop/assistos-workspace/assistos-sdk/modules/document/data/templates/document.json"}],"assistos-sdk/modules/space":[function(require,module,exports){
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


},{"../../../apihub-components/spaces-storage/templates/json/defaultApiKeyTemplate.json":"/home/axiologic/Desktop/assistos-workspace/apihub-components/spaces-storage/templates/json/defaultApiKeyTemplate.json","../../../apihub-components/spaces-storage/templates/json/defaultSpaceAnnouncement.json":"/home/axiologic/Desktop/assistos-workspace/apihub-components/spaces-storage/templates/json/defaultSpaceAnnouncement.json","../../../apihub-components/spaces-storage/templates/json/defaultSpaceNameTemplate.json":"/home/axiologic/Desktop/assistos-workspace/apihub-components/spaces-storage/templates/json/defaultSpaceNameTemplate.json","../../../apihub-components/spaces-storage/templates/json/defaultSpaceTemplate.json":"/home/axiologic/Desktop/assistos-workspace/apihub-components/spaces-storage/templates/json/defaultSpaceTemplate.json","../../../apihub-components/spaces-storage/templates/json/spaceValidationSchema.json":"/home/axiologic/Desktop/assistos-workspace/apihub-components/spaces-storage/templates/json/spaceValidationSchema.json","./apis":"/home/axiologic/Desktop/assistos-workspace/assistos-sdk/modules/space/apis/index.js"}],"assistos-sdk/modules/user":[function(require,module,exports){
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

},{"./apis":"/home/axiologic/Desktop/assistos-workspace/assistos-sdk/modules/user/apis/index.js"}],"assistos-sdk":[function(require,module,exports){
module.exports = {
    loadModule: function(moduleName) {
        switch (moduleName) {
            case 'document':
                return require('./modules/document');
            case 'space':
                return require('./modules/space');
            case 'user':
                return require('./modules/user');
            case 'services':
                return require('../apihub-components/email');
            default:
                return null;
        }
    },
    constants: require('./constants.js'),
};

},{"../apihub-components/email":"/home/axiologic/Desktop/assistos-workspace/apihub-components/email/index.js","./constants.js":"/home/axiologic/Desktop/assistos-workspace/assistos-sdk/constants.js","./modules/document":"/home/axiologic/Desktop/assistos-workspace/assistos-sdk/modules/document/index.js","./modules/space":"/home/axiologic/Desktop/assistos-workspace/assistos-sdk/modules/space/index.js","./modules/user":"/home/axiologic/Desktop/assistos-workspace/assistos-sdk/modules/user/index.js"}]},{},["/home/axiologic/Desktop/assistos-workspace/assistos-sdk/builds/tmp/assistOS_intermediar.js"])
                    ;(function(global) {
                        global.bundlePaths = {"assistOS":"build/bundles/assistOS.js"};
                    })(typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
                