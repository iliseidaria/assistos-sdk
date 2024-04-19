assistOSRequire=(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({"/home/mircea/Desktop/assistOS/assistos-sdk/builds/tmp/assistOS_intermediar.js":[function(require,module,exports){
(function (global){(function (){
global.assistOSLoadModules = function(){ 

	if(typeof $$.__runtimeModules["assistos-sdk"] === "undefined"){
		$$.__runtimeModules["assistos-sdk"] = require("assistos-sdk");
	}

	if(typeof $$.__runtimeModules["assistos-sdk/modules/document"] === "undefined"){
		$$.__runtimeModules["assistos-sdk/modules/document"] = require("assistos-sdk/modules/document");
	}

	if(typeof $$.__runtimeModules["assistos-sdk/modules/email"] === "undefined"){
		$$.__runtimeModules["assistos-sdk/modules/email"] = require("assistos-sdk/modules/email");
	}

	if(typeof $$.__runtimeModules["assistos-sdk/modules/space"] === "undefined"){
		$$.__runtimeModules["assistos-sdk/modules/space"] = require("assistos-sdk/modules/space");
	}

	if(typeof $$.__runtimeModules["assistos-sdk/modules/user"] === "undefined"){
		$$.__runtimeModules["assistos-sdk/modules/user"] = require("assistos-sdk/modules/user");
	}

	if(typeof $$.__runtimeModules["assistos-sdk/modules/util"] === "undefined"){
		$$.__runtimeModules["assistos-sdk/modules/util"] = require("assistos-sdk/modules/util");
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

},{"assistos-sdk":"assistos-sdk","assistos-sdk/modules/document":"assistos-sdk/modules/document","assistos-sdk/modules/email":"assistos-sdk/modules/email","assistos-sdk/modules/space":"assistos-sdk/modules/space","assistos-sdk/modules/user":"assistos-sdk/modules/user","assistos-sdk/modules/util":"assistos-sdk/modules/util"}],"/home/mircea/Desktop/assistOS/assistos-sdk/constants.js":[function(require,module,exports){
module.exports = {
    OBJECT_SCHEMAS: {
        documents: {
            position: "number",
            title: "string",
            topic: "string",
            abstract: "string",
            alternativeAbstracts: "array",
            mainIdeas: "array",
            alternativeTitles: "array",
            chapters: {
                type: "array",
                items: {
                    position: "number",
                    title: "string",
                    alternativeTitles: "array",
                    alternativeChapters: "array",
                    mainIdeas: "array",
                    paragraphs: {
                        type: "array",
                        items: {
                            position: "number",
                            alternativeParagraphs: "array",
                            mainIdeas: "array",
                            text: "string"
                        }
                    }
                }
            }
        }
    },
    DEFAULT_ID_LENGTH: 16
}
/* conventii:
*  container object e mereu la nivelul 0 din OBJECT_TYPES
*  container object e mereu obiect
*  embedded objects pot fi "string", "number" , "array"(are elemente identice ca structura) sau array cu o structura din obiecte specifice
*  embedded objects cu array */
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
async function addChapter(spaceId, documentId, chapterData){
    let chapterObj ={
        documentId: documentId,
        chapter: chapterData
    }
    return await sendRequest(`/spaces/${spaceId}/chapter`, "POST", chapterObj);
}
async function updateChapter(spaceId, documentId, chapterId, chapterData){
    let objectId = `document.${documentId}.chapter.${chapterId}`;
    return await sendRequest(`/spaces/${spaceId}/chapter/${objectId}`, "PUT", chapterData);
}
async function deleteChapter(spaceId, documentId, chapterId){
    let objectId = `document.${documentId}.chapter.${chapterId}`;
    return await sendRequest(`/spaces/${spaceId}/chapter/${objectId}`, "DELETE");
}

async function swapChapters(spaceId, documentId, chapterId1, chapterId2){
    let objectId = `document.${documentId}.chapter.${chapterId1}`;
    return await sendRequest(`/spaces/${spaceId}/chapterMetadata/${objectId}`, "PUT", chapterId2);
}
async function updateChapterTitle(spaceId, documentId, chapterId, title) {
    let objectId = `document.${documentId}.chapter.${chapterId}`;
    return await sendRequest(`/spaces/${spaceId}/chapterTitle/${objectId}`, "PUT", title);
}
async function addChapterMainIdea(spaceId, documentId, chapterId, mainIdea){
    let mainIdeaObj= {
        documentId: documentId,
        chapterId: chapterId,
        mainIdea: mainIdea
    }
    return await sendRequest(`/spaces/${spaceId}/chapterMainIdea`, "POST", mainIdeaObj);
}
async function updateChapterMainIdea(spaceId, documentId, chapterId, mainIdeaId, mainIdea){
    let objectId = `document.${documentId}.chapter.${chapterId}.chapterMainIdea.${mainIdeaId}`;
    return await sendRequest(`/spaces/${spaceId}/chapterMainIdea/${objectId}`, "PUT", mainIdea);
}
async function deleteChapterMainIdea(spaceId, documentId, chapterId, mainIdeaId){
    let objectId = `document.${documentId}.chapter.${chapterId}.chapterMainIdea.${mainIdeaId}`;
    return await sendRequest(`/spaces/${spaceId}/chapterMainIdea/${objectId}`, "DELETE");
}

async function addChapterAlternativeTitle(spaceId, documentId, chapterId, alternativeTitle){
    let alternativeTitleOb= {
        documentId: documentId,
        chapterId: chapterId,
        alternativeTitle: alternativeTitle
    }
    return await sendRequest(`/spaces/${spaceId}/chapterAlternativeTitle`, "POST", alternativeTitleOb);
}
async function updateChapterAlternativeTitle(spaceId, documentId, chapterId, alternativeTitleId, alternativeTitle){
    let objectId = `document.${documentId}.chapter.${chapterId}.alternativeTitle.${alternativeTitleId}`;
    return await sendRequest(`/spaces/${spaceId}/chapterAlternativeTitle/${objectId}`, "PUT", alternativeTitle);
}
async function deleteChapterAlternativeTitle(spaceId, documentId, chapterId, alternativeTitleId){
    let objectId = `document.${documentId}.chapter.${chapterId}.alternativeTitle.${alternativeTitleId}`;
    return await sendRequest(`/spaces/${spaceId}/chapterAlternativeTitle/${objectId}`, "DELETE");
}

async function addAlternativeChapter(spaceId, documentId, chapterId, alternativeChapter){
    let alternativeChapterOb= {
        documentId: documentId,
        chapterId: chapterId,
        alternativeChapter: alternativeChapter
    }
    return await sendRequest(`/spaces/${spaceId}/alternativeChapter`, "POST", alternativeChapterOb);
}
async function updateAlternativeChapter(spaceId, documentId, chapterId, alternativeChapterId, alternativeChapter){
    let objectId = `document.${documentId}.chapter.${chapterId}.alternativeChapter.${alternativeChapterId}`;
    return await sendRequest(`/spaces/${spaceId}/alternativeChapter/${objectId}`, "PUT", alternativeChapter);
}
async function deleteAlternativeChapter(spaceId, documentId, chapterId, alternativeChapterId){
    let objectId = `document.${documentId}.chapter.${chapterId}.alternativeChapter.${alternativeChapterId}`;
    return await sendRequest(`/spaces/${spaceId}/alternativeChapter/${objectId}`, "DELETE");
}
module.exports = {
    addChapter,
    updateChapter,
    deleteChapter,
    swapChapters,
    updateChapterTitle,
    addChapterMainIdea,
    updateChapterMainIdea,
    deleteChapterMainIdea,
    addChapterAlternativeTitle,
    updateChapterAlternativeTitle,
    deleteChapterAlternativeTitle,
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

async function getDocument(){
//not used
}
async function addDocument(spaceId, documentData){
    return await sendRequest(`/spaces/${spaceId}/document`, "POST", documentData);
}
async function updateDocument(spaceId, documentId, documentData){
    return await sendRequest(`/spaces/${spaceId}/document/${documentId}`, "PUT", documentData);
}
async function deleteDocument(spaceId, documentId){
    return await sendRequest(`/spaces/${spaceId}/document/${documentId}`, "DELETE");
}

async function updateDocumentTitle(spaceId, documentId, title) {
    let objectId = `document.${documentId}`;
    return await sendRequest(`/spaces/${spaceId}/title/${objectId}`, "PUT", title);
}
async function updateDocumentTopic(spaceId, documentId, topic) {
    let objectId = `document.${documentId}`;
    return await sendRequest(`/spaces/${spaceId}/topic/${objectId}`, "PUT", topic);
}
async function updateDocumentAbstract(spaceId, documentId, abstract) {
    let objectId = `document.${documentId}`;
    return await sendRequest(`/spaces/${spaceId}/abstract/${objectId}`, "PUT", abstract);
}

async function addDocumentMainIdea(spaceId, documentId, mainIdea){
    let mainIdeaObj= {
        documentId: documentId,
        mainIdea: mainIdea
    }
    return await sendRequest(`/spaces/${spaceId}/mainIdea`, "POST", mainIdeaObj);
}
async function updateDocumentMainIdea(spaceId, documentId, mainIdeaId, mainIdea){
    let objectId = `document.${documentId}.mainIdea.${mainIdeaId}`;
    return await sendRequest(`/spaces/${spaceId}/mainIdea/${objectId}`, "PUT", mainIdea);
}
async function deleteDocumentMainIdea(spaceId, documentId, mainIdeaId){
    let objectId = `document.${documentId}.mainIdea.${mainIdeaId}`;
    return await sendRequest(`/spaces/${spaceId}/mainIdea/${objectId}`, "DELETE");
}

async function addAlternativeTitle(spaceId, documentId, alternativeTitle){
    let alternativeTitleOb= {
        documentId: documentId,
        alternativeTitle: alternativeTitle
    }
    return await sendRequest(`/spaces/${spaceId}/alternativeTitle`, "POST", alternativeTitleOb);
}
async function updateAlternativeTitle(spaceId, documentId, alternativeTitleId, alternativeTitle){
    let objectId = `document.${documentId}.alternativeTitle.${alternativeTitleId}`;
    return await sendRequest(`/spaces/${spaceId}/alternativeTitle/${objectId}`, "PUT", alternativeTitle);
}
async function deleteAlternativeTitle(spaceId, documentId, alternativeTitleId){
    let objectId = `document.${documentId}.alternativeTitle.${alternativeTitleId}`;
    return await sendRequest(`/spaces/${spaceId}/alternativeTitle/${objectId}`, "DELETE");
}

async function addAlternativeAbstract(spaceId, documentId, alternativeAbstract){
    let alternativeAbstractOb= {
        documentId: documentId,
        alternativeAbstract: alternativeAbstract
    }
    return await sendRequest(`/spaces/${spaceId}/alternativeAbstract`, "POST", alternativeAbstractOb);
}
async function updateAlternativeAbstract(spaceId, documentId, alternativeAbstractId, alternativeAbstract){
    let objectId = `document.${documentId}.alternativeAbstract.${alternativeAbstractId}`;
    return await sendRequest(`/spaces/${spaceId}/alternativeAbstract/${objectId}`, "PUT", alternativeAbstract);
}
async function deleteAlternativeAbstract(spaceId, documentId, alternativeAbstractId){
    let objectId = `document.${documentId}.alternativeAbstract.${alternativeAbstractId}`;
    return await sendRequest(`/spaces/${spaceId}/alternativeAbstract/${objectId}`, "DELETE");
}

module.exports = {
    getDocument,
    addDocument,
    updateDocument,
    deleteDocument,
    updateDocumentTitle,
    updateDocumentTopic,
    updateDocumentAbstract,
    addDocumentMainIdea,
    updateDocumentMainIdea,
    deleteDocumentMainIdea,
    addAlternativeTitle,
    updateAlternativeTitle,
    deleteAlternativeTitle,
    addAlternativeAbstract,
    updateAlternativeAbstract,
    deleteAlternativeAbstract,
};
},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/document/apis/paragraph.js":[function(require,module,exports){
async function addParagraph(spaceId, documentId, chapterId, paragraphData){
    let paragraphObj ={
        documentId: documentId,
        chapterId: chapterId,
        paragraph: paragraphData
    }
    return await sendRequest(`/spaces/${spaceId}/paragraph`, "POST", paragraphObj);
}
async function updateParagraph(spaceId, documentId, chapterId, paragraphId, paragraphData){
    let objectId = `document.${documentId}.chapter.${chapterId}.paragraph.${paragraphId}`;
    return await sendRequest(`/spaces/${spaceId}/paragraph/${objectId}`, "PUT", paragraphData);
}
async function deleteParagraph(spaceId, documentId, chapterId, paragraphId){
    let objectId = `document.${documentId}.chapter.${chapterId}.paragraph.${paragraphId}`;
    return await sendRequest(`/spaces/${spaceId}/paragraph/${objectId}`, "DELETE");
}

async function swapParagraphs(spaceId, documentId, chapterId, paragraphId1, paragraphId2){
    let objectId = `document.${documentId}.chapter.${chapterId}.paragraph.${paragraphId1}`;
    return await sendRequest(`/spaces/${spaceId}/paragraphMetadata/${objectId}`, "PUT", paragraphId2);
}
async function updateParagraphText(spaceId, documentId, chapterId, paragraphId, text) {
    let objectId = `document.${documentId}.chapter.${chapterId}.paragraph.${paragraphId}`;
    return await sendRequest(`/spaces/${spaceId}/paragraphText/${objectId}`, "PUT", text);
}
async function updateParagraphMainIdea(spaceId, documentId, chapterId, paragraphId, mainIdea) {
    let objectId = `document.${documentId}.chapter.${chapterId}.paragraph.${paragraphId}`;
    return await sendRequest(`/spaces/${spaceId}/paragraphMainIdea/${objectId}`, "PUT", mainIdea);
}

async function addAlternativeParagraph(spaceId, documentId, chapterId, paragraphId, alternativeParagraph){
    let alternativeParagraphOb= {
        documentId: documentId,
        chapterId: chapterId,
        paragraphId: paragraphId,
        alternativeParagraph: alternativeParagraph
    }
    return await sendRequest(`/spaces/${spaceId}/alternativeParagraph`, "POST", alternativeParagraphOb);
}
async function updateAlternativeParagraph(spaceId, documentId, chapterId, paragraphId, alternativeParagraphId, alternativeParagraph){
    let objectId = `document.${documentId}.chapter.${chapterId}.paragraph.${paragraphId}.alternativeParagraph.${alternativeParagraphId}`;
    return await sendRequest(`/spaces/${spaceId}/alternativeParagraph/${objectId}`, "PUT", alternativeParagraph);
}
async function deleteAlternativeParagraph(spaceId, documentId, chapterId, paragraphId, alternativeParagraphId){
    let objectId = `document.${documentId}.chapter.${chapterId}.paragraph.${paragraphId}.alternativeParagraph.${alternativeParagraphId}`;
    return await sendRequest(`/spaces/${spaceId}/alternativeParagraph/${objectId}`, "DELETE");
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
},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/email/api/index.js":[function(require,module,exports){
(function (__dirname){(function (){
const nodemailer = require('nodemailer');
const emailConfig = require('../data/json/config_1.json');
const fsPromises = require('fs').promises;

const path = require('path');
const activationEmailTemplatePath = path.join(__dirname, '..', 'data', 'templates', 'html', 'activationEmailTemplate.html');


const Loader = require('../../../index.js')
const utilModule = Loader.loadModule('util')
const data = utilModule.loadAPIs('data')

const {ENVIRONMENT_MODE, PRODUCTION_BASE_URL, DEVELOPMENT_BASE_URL} = require('../data/json/config.json')

class Email {
    constructor() {
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
        const activationEmailTemplate = await fsPromises.readFile(activationEmailTemplatePath, 'utf8')
        let baseURL = ""

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
}).call(this)}).call(this,"/modules/email/api")

},{"../../../index.js":"/home/mircea/Desktop/assistOS/assistos-sdk/index.js","../data/json/config.json":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/email/data/json/config.json","../data/json/config_1.json":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/email/data/json/config_1.json","fs":false,"nodemailer":false,"path":false}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/email/data/json/config.json":[function(require,module,exports){
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
},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/email/data/json/config_1.json":[function(require,module,exports){
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
},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/space/apis/index.js":[function(require,module,exports){
const path = require('path');
const fsPromises = require('fs').promises;

const Loader = require('../../../index.js');
const constants=Loader.loadModule('constants');
const config=Loader.loadModule('config');
const utilsModule = Loader.loadModule('util');
const userModule = Loader.loadModule('user');
const spaceModule= Loader.loadModule('space');
const documentModule= Loader.loadModule('document');
const documentAPIs = documentModule.loadAPIs();
const {crypto, file, data, date, openAI} = utilsModule.loadAPIs('crypto', 'file', 'data', 'date', 'openAI');
const enclave = require('opendsu').loadAPI('enclave');

function getSpacePath(spaceId) {
    return path.join(Loader.getStorageVolumePaths('space'), spaceId);
}

function getSpaceFolderPath() {
    return Loader.getStorageVolumePaths('space');
}

function getSpaceMapPath() {
    return Loader.getStorageVolumePaths('spaceMap');
}

async function updateSpaceMap(spaceMapObject) {
    await fsPromises.writeFile(getSpaceMapPath(), JSON.stringify(spaceMapObject, null, 2), 'utf8');
}

async function getSpaceMap() {
    const spaceMapPath = getSpaceMapPath();
    return JSON.parse(await fsPromises.readFile(spaceMapPath, 'utf8'));
}

async function addAnnouncement(spaceId, announcementObject) {
    const spaceStatusObject = getSpaceStatusObject(spaceId)
    spaceStatusObject.announcements.push(announcementObject)
    await updateSpaceStatus(spaceStatusObject);
}

async function addSpaceToSpaceMap(spaceId, spaceName) {
    let spacesMapObject = await getSpaceMap();

    if (spacesMapObject.hasOwnProperty(spaceId)) {
        throw new Error(`Space with id ${spaceId} already exists`);
    } else {
        spacesMapObject[spaceId] = spaceName;
    }
    await updateSpaceMap(spacesMapObject);
}

async function copyDefaultFlows(spacePath) {

    const defaultFlowsPath = Loader.getStorageVolumePaths('defaultFlows');
    const flowsPath = path.join(spacePath, 'flows');
    await file.createDirectory(flowsPath);

    const files = await fsPromises.readdir(defaultFlowsPath);

    for (const file of files) {
        const filePath = path.join(defaultFlowsPath, file);
        const destFilePath = path.join(flowsPath, file);
        await fsPromises.copyFile(filePath, destFilePath);
    }
}

async function copyDefaultPersonalities(spacePath) {

    const defaultPersonalitiesPath = Loader.getStorageVolumePaths('defaultPersonalities');
    const personalitiesPath = path.join(spacePath, 'personalities');

    await file.createDirectory(personalitiesPath);

    const files = await fsPromises.readdir(defaultPersonalitiesPath);

    for (const file of files) {
        const filePath = path.join(defaultPersonalitiesPath, file);
        const destFilePath = path.join(personalitiesPath, file);
        await fsPromises.copyFile(filePath, destFilePath);
    }
}

function createDefaultAnnouncement(spaceName) {
    const spaceData= spaceModule.loadData();
    const currentDate = date.getCurrentUTCDate();
    const announcementId = crypto.generateId();
    return data.fillTemplate(spaceData.defaultSpaceAnnouncement,
        {
            announcementId: announcementId,
            spaceName: spaceName,
            currentUTCDate: currentDate
        })
}

async function createSpace(spaceName, userId, apiKey) {
    const spaceData=spaceModule.loadData();
    const userAPIs= userModule.loadAPIs();
    const rollback = async (spacePath) => {
        try {
            await fsPromises.rm(spacePath, {recursive: true, force: true});
        } catch (error) {
            console.error(`Failed to clean up space directory at ${spacePath}: ${error}`);
            throw error;
        }
    };

    const spaceId = crypto.generateId();
    let spaceObj = {}
    try {
        spaceObj = data.fillTemplate(spaceData.defaultSpaceTemplate, {
            spaceName: spaceName,
            spaceId: spaceId,
            adminId: userId,
            apiKey: apiKey ? data.fillTemplate(spaceData.defaultApiKeyTemplate, {
                keyType: "OpenAI",
                ownerId: userId,
                keyId: crypto.generateId(),
                keyValue: openAI.maskKey(apiKey)
            }) : undefined,
            defaultAnnouncement: createDefaultAnnouncement(spaceName),
            creationDate: date.getCurrentUTCDate()
        });
    } catch (error) {
        error.message = 'Error creating space';
        error.statusCode = 500;
        throw error;
    }
    let spaceValidationResult = {};
    try {
        spaceValidationResult = data.validateObject(spaceData.spaceValidationSchema, spaceObj);
    } catch (error) {
        error.message = 'Error validating space data';
        error.statusCode = 500;
        throw error;
    }
    if (spaceValidationResult.status === false) {
        const error = new Error(spaceValidationResult.errorMessage);
        error.statusCode = 400;
        throw error;
    }

    const spacePath = getSpacePath(spaceId);

    await file.createDirectory(spacePath);
    const filesPromises = [
        () => copyDefaultFlows(spacePath),
        () => copyDefaultPersonalities(spacePath),
        () => file.createDirectory(path.join(spacePath, 'documents')),
        () => file.createDirectory(path.join(spacePath, 'applications')),
        () => createSpaceStatus(spacePath, spaceObj),
        () => userAPIs.linkSpaceToUser(userId, spaceId),
        () => addSpaceToSpaceMap(spaceId, spaceName),
    ].concat(apiKey ? [() => saveSpaceAPIKeySecret(spaceId, apiKey)] : []);

    const results = await Promise.allSettled(filesPromises.map(fn => fn()));
    const failed = results.filter(r => r.status === 'rejected');

    if (failed.length > 0) {
        await rollback(spacePath);
        const error = new Error(failed.map(op => op.reason?.message || 'Unknown error').join(', '));
        error.statusCode = 500;
        throw error;
    }
    let lightDBEnclaveClient = enclave.initialiseLightDBEnclave(spaceId);
    await $$.promisify(lightDBEnclaveClient.createDatabase)(spaceId);
    await $$.promisify(lightDBEnclaveClient.grantWriteAccess)($$.SYSTEM_IDENTIFIER);
    return spaceObj;
}

async function createSpaceStatus(spacePath, spaceObject) {
    await file.createDirectory(path.join(spacePath, 'status'));
    const statusPath = path.join(spacePath, 'status', 'status.json');
    await fsPromises.writeFile(statusPath, JSON.stringify(spaceObject, null, 2));
}
async function deleteSpace() {

}

async function getSpaceDocumentsObject(spaceId) {
    let lightDBEnclaveClient = enclave.initialiseLightDBEnclave(spaceId);
    let documents = [];
    let records;
    try {
        records = await $$.promisify(lightDBEnclaveClient.getAllRecords)($$.SYSTEM_IDENTIFIER, 'documents');
    }catch (e){
        console.log(e + "no documents yet");
        return documents;
    }
    let documentIds = records.map(record => record.data);
    for(let documentId of documentIds){
        documents.push(documentAPIs.document.get(spaceId, documentId));
    }
    documents = await Promise.all(documents);
    documents.sort((a, b) => a.position - b.position);
    return documents;
}


async function getSpacePersonalitiesObject(spaceId) {

    const personalitiesDirectoryPath = path.join(getSpacePath(spaceId), 'personalities');

    const personalitiesFiles = await fsPromises.readdir(personalitiesDirectoryPath, {withFileTypes: true});

    const sortedPersonalitiesFiles = await file.sortFiles(personalitiesFiles, personalitiesDirectoryPath, 'creationDate');

    let spacePersonalitiesObject = [];

    for (const fileName of sortedPersonalitiesFiles) {
        const personalityJson = await fsPromises.readFile(path.join(personalitiesDirectoryPath, fileName), 'utf8');
        spacePersonalitiesObject.push(JSON.parse(personalityJson));
    }
    return spacePersonalitiesObject;

}

async function getSpaceStatusObject(spaceId) {
    const spaceStatusPath = path.join(getSpacePath(spaceId), 'status', 'status.json');
    try {
        const spaceStatusObject = JSON.parse(await fsPromises.readFile(spaceStatusPath, {encoding: 'utf8'}));
        return spaceStatusObject
    } catch (error) {
        error.message = `Space ${spaceId} not found.`;
        error.statusCode = 404;
        throw error;
    }
}

async function saveSpaceAPIKeySecret(spaceId, apiKey) {
    const apihub = require('apihub');

    const secretsService = await apihub.getSecretsServiceInstanceAsync(config.SERVER_ROOT_FOLDER);
    const containerName = `${spaceId}.APIKey`
    const keyValidation = await openAI.validateOpenAiKey(apiKey);
    if (keyValidation) {
        await secretsService.putSecretAsync(containerName, "OpenAiAPIKey", apiKey);
    }
}

async function storeSpaceSecret(spaceId, secret) {
}

async function updateSpaceStatus(spaceId, spaceStatusObject) {
    const spacePath = getSpacePath(spaceId)
    const spaceStatusPath = path.join(spacePath, 'status', `status.json`);
    await fsPromises.writeFile(spaceStatusPath, JSON.stringify(spaceStatusObject, null, 2), {encoding: 'utf8'});
}
async function getObject(spaceId, objectType, objectId) {
    if(!constants.OBJECT_TYPES[objectType]){
        throw new Error(`Invalid object type: ${objectType}`);
    }
    if(!documentAPIs[constants.OBJECT_TYPES[objectType]]["get"]){
        throw new Error(`No ADD API found for object type: ${objectType}`);
    }
    return await documentAPIs[constants.OBJECT_TYPES[objectType]]["get"](spaceId, objectId);
}

async function addObject(spaceId, objectType, objectData) {
    if(!constants.OBJECT_TYPES[objectType]){
        throw new Error(`Invalid object type: ${objectType}`);
    }
    if(!documentAPIs[constants.OBJECT_TYPES[objectType]]["add"]){
        throw new Error(`No ADD API found for object type: ${objectType}`);
    }
    return await documentAPIs[constants.OBJECT_TYPES[objectType]]["add"](spaceId, objectData);
}

async function updateObject(spaceId, objectType, objectId, objectData) {
    if(!constants.OBJECT_TYPES[objectType]){
        throw new Error(`Invalid object type: ${objectType}`);
    }
    if(!documentAPIs[constants.OBJECT_TYPES[objectType]]["update"]){
        throw new Error(`No ADD API found for object type: ${objectType}`);
    }
    return await documentAPIs[constants.OBJECT_TYPES[objectType]]["update"](spaceId, objectId, objectData);
}
async function deleteObject(spaceId, objectType, objectId) {
    if(!constants.OBJECT_TYPES[objectType]){
        throw new Error(`Invalid object type: ${objectType}`);
    }
    if(!documentAPIs[constants.OBJECT_TYPES[objectType]]["delete"]){
        throw new Error(`No ADD API found for object type: ${objectType}`);
    }
    return await documentAPIs[constants.OBJECT_TYPES[objectType]]["delete"](spaceId, objectId);
}
module.exports = {
    addAnnouncement,
    addSpaceToSpaceMap,
    copyDefaultFlows,
    copyDefaultPersonalities,
    createDefaultAnnouncement,
    createSpace,
    createSpaceStatus,
    addObject,
    updateObject,
    deleteObject,
    getSpaceDocumentsObject,
    getSpacePersonalitiesObject,
    getSpaceMap,
    getSpaceStatusObject,
    saveSpaceAPIKeySecret,
    storeSpaceSecret,
    updateSpaceStatus,
    deleteSpace
}


},{"../../../index.js":"/home/mircea/Desktop/assistOS/assistos-sdk/index.js","apihub":false,"fs":false,"opendsu":false,"path":false}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/space/data/templates/json/defaultApiKeyTemplate.json":[function(require,module,exports){
module.exports={
  "type": "$$keyType",
  "ownerId": "$$ownerId",
  "id": "$$keyId",
  "value": "$$keyValue"
}

},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/space/data/templates/json/defaultSpaceAnnouncement.json":[function(require,module,exports){
module.exports={
  "id": "$$announcementId",
  "title": "Welcome to AssistOS!",
  "text": "Space $$spaceName was successfully created. You can now add documents, users and settings to your space.",
  "date": "$$currentUTCDate"
}
},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/space/data/templates/json/defaultSpaceNameTemplate.json":[function(require,module,exports){
module.exports="$$username Space"

},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/space/data/templates/json/defaultSpaceTemplate.json":[function(require,module,exports){
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
},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/space/data/templates/spaceValidationSchema.json":[function(require,module,exports){
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

},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/user/apis/index.js":[function(require,module,exports){
const fsPromises = require('fs').promises;
const path= require('path')

const Loader = require('../../../index.js')

const config = Loader.loadModule('config')
const utilsModule = Loader.loadModule('util')
const {crypto, date, data} = utilsModule.loadAPIs('crypto', 'date', 'data')
const spaceModule = Loader.loadModule('space')
const userModule= Loader.loadModule('user')

async function activateUser(activationToken) {
    const userPendingActivation = await getUserPendingActivation()
    if (!userPendingActivation[activationToken]) {
        const error = new Error('Invalid activation token');
        error.statusCode = 404;
        throw error;
    }
    if (date.compareUTCDates(userPendingActivation[activationToken].verificationTokenExpirationDate, date.getCurrentUTCDate()) < 0) {
        delete userPendingActivation[activationToken]
        await updateUserPendingActivation(userPendingActivation)
        const error = new Error('Token Activation Expired');
        error.statusCode = 404;
        throw error;
    }

    const user = userPendingActivation[activationToken];
    try {
        const userDataObject = await createUser(user.name, user.email, true);
        const userMap = await getUserMap();
        userMap[user.email] = userDataObject.id;
        await updateUserMap(userMap);

        const userCredentials = await getUserCredentials();
        userCredentials[userDataObject.id] = user;
        userCredentials[userDataObject.id].activationDate = date.getCurrentUTCDate();
        await updateUserCredentials(userCredentials);

        return userDataObject;
    } catch (error) {
        throw error;
    } finally {
        delete userPendingActivation[activationToken]
        await updateUserPendingActivation(userPendingActivation);
    }
}

async function addSpaceCollaborator(spaceId, userId, role) {
    await linkSpaceToUser(userId, spaceId)
    try {
        await linkUserToSpace(spaceId, userId, role)
    } catch (error) {
        await unlinkSpaceFromUser(userId, spaceId);
        throw error;
    }
}

async function createDemoUser() {
    const {username, email, password} = userModule.loadData('templates').demoUser
    await registerUser(username, email, crypto.hashPassword(password))
    const userPendingActivation = await getUserPendingActivation()
    const activationToken = Object.keys(userPendingActivation)[0]
    await activateUser(activationToken)
}

async function createUser(username, email, withDefaultSpace = false) {
    const spaceAPIs = spaceModule.loadAPIs()
    const spaceData = spaceModule.loadData('templates')
    const userData= userModule.loadData('templates')
    const rollback = async () => {
        await fsPromises.rm(userPath, {recursive: true, force: true});
        if (withDefaultSpace) {
            await spaceAPIs.deleteSpace(userData.currentSpaceId)
        }
    }

    const userId = crypto.generateId();
    const spaceName = data.fillTemplate(
        spaceData.defaultSpaceNameTemplate,
        {
            username: username.endsWith('s') ? username + "'" : username + "'s"
        }
    )
    const user = data.fillTemplate(userData.defaultUserTemplate,
        {
            id: userId,
            username: username,
            email: email,
        }
    )

    const userPath = getUserFilePath(userId)
    try {
        await updateUserFile(userId, user)
        if (withDefaultSpace) {
            const createdSpaceId = (await spaceAPIs.createSpace(spaceName, userId)).id;
            user.currentSpaceId = createdSpaceId
            user.spaces.push(createdSpaceId);
        }
        await updateUserFile(userId, user)
        return user;
    } catch (error) {
        await rollback();
        throw error;
    }
}

async function getActivationFailHTML(failReason) {
    const emailData = await Loader.loadModule('services').loadServices('email').data
    let redirectURL = config.ENVIRONMENT_MODE === 'development' ? config.DEVELOPMENT_BASE_URL : config.PRODUCTION_BASE_URL
    return data.fillTemplate(emailData.templates.activationFailTemplate, {
        redirectURL: redirectURL,
        failReason: failReason
    })
}

async function getActivationSuccessHTML() {
    const emailData = await Loader.loadModule('services').loadServices('email').data
    let loginRedirectURL = config.ENVIRONMENT_MODE === 'development' ? config.DEVELOPMENT_BASE_URL : config.PRODUCTION_BASE_URL
    return data.fillTemplate(emailData.templates.activationSuccessTemplate, {
        loginRedirectURL: loginRedirectURL
    })
}

async function getUserData(userId) {
    const spaceAPIs = spaceModule.loadAPIs()
    const userFile = await getUserFile(userId)
    const spacesMap = await spaceAPIs.getSpaceMap();
    userFile.spaces = userFile.spaces.map(space => {
        return {
            name: spacesMap[space],
            id: space
        };
    });
    return userFile;
}

async function getUserIdByEmail(email) {
    const userMap = await getUserMap()
    if (userMap[email]) {
        return userMap[email];
    } else {
        const error = new Error('No user found with this email');
        error.statusCode = 404;
        throw error;
    }
}

async function linkSpaceToUser(userId, spaceId) {
    const userFile = await getUserFile(userId)

    if (userFile.spaces.some(space => space.id === spaceId)) {
        const error = new Error(`Space ${spaceId} is already linked to user ${userId}.`);
        error.statusCode = 400;
        throw error;
    }
    userFile.spaces.push(spaceId);
    userFile.currentSpaceId = spaceId;
    await updateUserFile(userId, userFile);

}

async function linkUserToSpace(spaceId, userId, role) {
    const spaceAPIs = spaceModule.loadAPIs()
    const spaceStatusObject = await spaceAPIs.getSpaceStatusObject(spaceId);
    if (!spaceStatusObject.users || !Array.isArray(spaceStatusObject.users)) {
        const error = new Error(`Corrupted Space file for Space: ${spaceStatusObject.name}`);
        error.statusCode = 500;
        throw error;
    }
    if (!spaceStatusObject.users.find(user => user.userId === userId)) {
        spaceStatusObject.users.push(
            {
                userId: userId,
                role: role,
                joinDate: date.getCurrentUTCDate()
            }
        )
    } else {
        const error = new Error(`User is already member of the Space: ${spaceStatusObject.name}`);
        error.statusCode = 409
        throw error
    }
    await spaceAPIs.updateSpaceStatus(spaceId, spaceStatusObject);
}

async function loginUser(email, password) {
    const userId = await getUserIdByEmail(email).catch(() => {
        throw new Error('Invalid credentials');
    });

    const userCredentials = await getUserCredentials();
    const hashedPassword = crypto.hashPassword(password);
    if (userCredentials[userId].password === hashedPassword) {
        return userId;
    }

    throw new Error('Invalid credentials');
}

async function registerUser(name, email, password) {
    const currentDate = date.getCurrentUTCDate();
    const userData = userModule.loadData('templates')
    const registrationUserObject = data.fillTemplate(userData.userRegistrationTemplate, {
        email: email,
        name: name,
        passwordHash: crypto.hashPassword(password),
        verificationToken: await crypto.generateVerificationToken(),
        verificationTokenExpirationDate: date.incrementUTCDate(currentDate, {minutes: 30}),
        currentDate: currentDate,
    })
    const userMap = await getUserMap()
    if (userMap[email]) {
        const error = new Error(`User with email ${email} already exists`);
        error.statusCode = 409;
        throw error;
    }

    const userPendingActivation = await getUserPendingActivation()
    userPendingActivation[registrationUserObject.verificationToken] = registrationUserObject
    await updateUserPendingActivation(userPendingActivation)
    await sendActivationEmail(email, name, registrationUserObject.verificationToken);
}

async function sendActivationEmail(emailAddress, username, activationToken) {
    const emailService = Loader.loadModule('services').loadServices('email').service.getInstance()
    await emailService.sendActivationEmail(emailAddress, username, activationToken);
}

async function unlinkSpaceFromUser(userId, spaceId) {
    const userFile = await getUserFile(userId)

    const spaceIndex = userFile.spaces.findIndex(space => space.id === spaceId);
    if (spaceIndex === -1) {
        return;
    }

    userFile.spaces.splice(spaceIndex, 1);

    if (userFile.currentSpaceId === spaceId) {
        delete userFile.currentSpaceId;
    }
    await updateUserFile(userId, userFile)
}

function getUserPendingActivationPath() {
    return Loader.getStorageVolumePaths('userPendingActivation')
}

async function getUserPendingActivation() {
    const userPendingActivationPath = getUserPendingActivationPath();
    try {
        await fsPromises.access(userPendingActivationPath);
    } catch (error) {
        error.message = 'User pending activation not found';
        error.statusCode = 404;
        throw error;
    }
    const userPendingActivation = await fsPromises.readFile(userPendingActivationPath, 'utf8');
    return JSON.parse(userPendingActivation);
}

async function updateUserPendingActivation(userPendingActivationObject) {
    await fsPromises.writeFile(getUserPendingActivationPath(), JSON.stringify(userPendingActivationObject, null, 2));
}

function getUserCredentialsPath() {
    return Loader.getStorageVolumePaths('userCredentials')
}

async function getUserCredentials() {
    const userCredentialsPath = getUserCredentialsPath();
    try {
        await fsPromises.access(userCredentialsPath);
    } catch (error) {
        error.message = 'User credentials not found';
        error.statusCode = 404;
        throw error;
    }
    const userCredentials = await fsPromises.readFile(userCredentialsPath, 'utf8');
    return JSON.parse(userCredentials);
}

async function updateUserCredentials(userCredentialsObject) {
    await fsPromises.writeFile(getUserCredentialsPath(), JSON.stringify(userCredentialsObject, null, 2));
}

function getUserMapPath() {
    return Loader.getStorageVolumePaths('userMap')
}

async function getUserMap() {
    const userMapPath = getUserMapPath();
    try {
        await fsPromises.access(userMapPath);
    } catch (error) {
        error.message = 'User map not found';
        error.statusCode = 404;
        throw error;
    }
    const userMap = await fsPromises.readFile(userMapPath, 'utf8');
    return JSON.parse(userMap);
}

async function updateUserMap(userMapObject) {
    await fsPromises.writeFile(getUserMapPath(), JSON.stringify(userMapObject, null, 2));
}

function getUserFilePath(userId) {
    return path.join(Loader.getStorageVolumePaths('user'), `${userId}.json`);
}

async function getUserFile(userId) {
    const userFilePath = await getUserFilePath(userId)
    try {
        await fsPromises.access(userFilePath);
    } catch (e) {
        const error = new Error(`User with id ${userId} does not exist`);
        error.statusCode = 404;
        throw error;
    }
    let userFile = await fsPromises.readFile(userFilePath, 'utf8');
    return JSON.parse(userFile);
}

async function updateUserFile(userId, userObject) {
    await fsPromises.writeFile(getUserFilePath(userId), JSON.stringify(userObject, null, 2), 'utf8', {encoding: 'utf8'});
}

async function updateUsersCurrentSpace(userId, spaceId) {
    const userFile = await getUserFile(userId);
    userFile.currentSpaceId = spaceId;
    await updateUserFile(userId, userFile);
}
async function getDefaultSpaceId(userId) {
    const userFile = await getUserFile(userId)
    return userFile.currentSpaceId;
}

module.exports = {
    activateUser,
    addSpaceCollaborator,
    createDemoUser,
    createUser,
    getActivationFailHTML,
    getActivationSuccessHTML,
    getUserData,
    getUserFile,
    getUserFilePath,
    getUserIdByEmail,
    linkSpaceToUser,
    linkUserToSpace,
    loginUser,
    registerUser,
    sendActivationEmail,
    unlinkSpaceFromUser,
    updateUserFile,
    updateUsersCurrentSpace,
    getDefaultSpaceId
}

},{"../../../index.js":"/home/mircea/Desktop/assistOS/assistos-sdk/index.js","fs":false,"path":false}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/user/data/templates/json/defaultApiKeyTemplate.json":[function(require,module,exports){
arguments[4]["/home/mircea/Desktop/assistOS/assistos-sdk/modules/space/data/templates/json/defaultApiKeyTemplate.json"][0].apply(exports,arguments)
},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/user/data/templates/json/defaultUserTemplate.json":[function(require,module,exports){
module.exports={
  "id": "$$id",
  "name": "$$username",
  "email": "$$email",
  "spaces": [],
  "currentSpaceId": "$$currentSpaceId?"
}
},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/user/data/templates/json/demoUser.json":[function(require,module,exports){
module.exports={
  "email": "victor@axiologic.net",
  "password": "demo2024",
  "username": "Axiologic"
}
},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/user/data/templates/json/userRegistrationTemplate.json":[function(require,module,exports){
module.exports={
  "name": "$$name",
  "email": "$$email",
  "password": "$$passwordHash",
  "creationDate": "$$currentDate",
  "verificationToken": "$$verificationToken",
  "verificationTokenIssueDate": "$$currentDate",
  "verificationTokenExpirationDate": "$$verificationTokenExpirationDate"
}
},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/util/apis/crypto.js":[function(require,module,exports){
const crypto = require("opendsu").loadAPI("crypto");

const DEFAULT_ID_LENGTH = 16
const DEFAULT_SECRET_LENGTH = 64;

function generateId(length = DEFAULT_ID_LENGTH) {
    let random = crypto.getRandomSecret(length);
    let randomStringId = "";
    while (randomStringId.length < length) {
        randomStringId = crypto.encodeBase58(random).slice(0, length);
    }
    return randomStringId;
}

async function generateVerificationToken() {
    return await crypto.getRandomSecret(64);
}

function generateSecret(length = DEFAULT_SECRET_LENGTH) {
    return crypto.getRandomSecret(length);
}

function hashPassword(password) {
    return Array.from(crypto.sha256JOSE(password))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}


module.exports = {
    hashPassword,
    generateSecret,
    generateVerificationToken,
    generateId
}

},{"opendsu":false}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/util/apis/data.js":[function(require,module,exports){
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
},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/util/apis/date.js":[function(require,module,exports){
function getCurrentUnixTime() {
    return Math.floor(Date.now() / 1000);
}
function incrementUnixTime(unixTimestamp, incrementObject) {
    const {seconds = 0, minutes = 0, hours = 0, days = 0, months = 0, years = 0} = incrementObject;
    const totalSeconds = seconds +
        minutes * 60 +
        hours * 3600 +
        days * 86400 +
        months * 2629746 +
        years * 31556952;

    return unixTimestamp + totalSeconds;
}

function getCurrentUTCDate() {
    const now = new Date();

    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}
function incrementUTCDate(dateStringUTC, incrementObject) {
    const {seconds = 0, minutes = 0, hours = 0, days = 0, months = 0, years = 0} = incrementObject;
    let date = new Date(dateStringUTC);
    date.setUTCSeconds(date.getUTCSeconds() + seconds);
    date.setUTCMinutes(date.getUTCMinutes() + minutes);
    date.setUTCHours(date.getUTCHours() + hours);
    date.setUTCDate(date.getUTCDate() + days);
    date.setUTCMonth(date.getUTCMonth() + months);
    date.setUTCFullYear(date.getUTCFullYear() + years);

    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hour = String(date.getUTCHours()).padStart(2, '0');
    const minute = String(date.getUTCMinutes()).padStart(2, '0');
    const second = String(date.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
}
function compareUTCDates(d1, d2) {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    return date1.getTime() - date2.getTime();
}

function compareUnixDates(t1, t2) {
    return t1 - t2;
}


module.exports = {
    getCurrentUTCDate,
    getCurrentUnixTime,
    incrementUTCDate,
    incrementUnixTime,
    compareUTCDates,
    compareUnixDates
};

},{}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/util/apis/file.js":[function(require,module,exports){
const path = require('path');
const fsPromises = require('fs').promises;
async function createDirectory(directoryPath) {
    try {
        await fsPromises.access(directoryPath);
        const error = new Error('Directory already exists');
        error.statusCode = 409;
        throw error;
    } catch (e) {
        if (e.code === 'ENOENT') {
            await fsPromises.mkdir(directoryPath);
        } else {
            throw e;
        }
    }
}

async function sortFiles(files, directoryPath, criterion = 'filename') {
    let filesAttributes = await Promise.all(files.filter(file => file.isFile()).map(async (file) => {
        const fullPath = path.join(directoryPath, file.name);
        const stats = await fsPromises.stat(fullPath);
        return {
            name: file.name,
            extension: path.extname(file.name).toLowerCase(),
            birthtimeMs: stats.birthtimeMs,
            mtimeMs: stats.mtimeMs,
            ctimeMs: stats.ctimeMs
        };
    }));

    switch (criterion) {
        case 'lastEditDate':
            filesAttributes.sort((a, b) => b.mtimeMs - a.mtimeMs);
            break;
        case 'creationDate':
            filesAttributes.sort((a, b) => a.birthtimeMs - b.birthtimeMs);
            break;
        case 'filename':
            filesAttributes.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'extension':
            filesAttributes.sort((a, b) => a.extension.localeCompare(b.extension) || a.name.localeCompare(b.name));
            break;
        default:
            if (typeof criterion === 'function') {
                filesAttributes.sort(criterion);
            }
            break;
    }

    return filesAttributes.map(file => file.name);
}


module.exports = {
    sortFiles,
    createDirectory
};

},{"fs":false,"path":false}],"/home/mircea/Desktop/assistOS/assistos-sdk/modules/util/apis/openAI.js":[function(require,module,exports){
function maskKey(str) {
    if (str.length <= 10) {
        return str;
    }
    const start = str.slice(0, 6);
    const end = str.slice(-4);
    const maskedLength = str.length - 10;
    const masked = '*'.repeat(maskedLength);
    return start + masked + end;
}

async function validateOpenAiKey(apiKey) {
    const endpoint = 'https://api.openai.com/v1/models';
    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        if (response.ok) {
            return true;
        } else {
            const errorData = await response.json();
            let errorMessage = `Error: ${response.status} - ${errorData.error}`;
            switch (response.status) {
                case 401:
                case 403:
                    errorMessage = 'Unauthorized: Invalid API Key';
                    break;
                case 404:
                    errorMessage = 'Invalid Endpoint';
                    break;
                case 500:
                case 502:
                case 503:
                case 504:
                    errorMessage = 'Server Error: OpenAI may be experiencing issues. Please try again later.';
                    break;
                default:
                    break;
            }
            throw new Error(errorMessage);
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    validateOpenAiKey,
    maskKey
}

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

},{"./apis/chapter.js":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/document/apis/chapter.js","./apis/document.js":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/document/apis/document.js","./apis/paragraph.js":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/document/apis/paragraph.js","./data/templates/document.json":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/document/data/templates/document.json"}],"assistos-sdk/modules/email":[function(require,module,exports){
const service = require('./api');
const fsPromises = require('fs').promises;
const path = require('path');
// const data = (async () => {
//     return {
//         templates: {
//             activationFailTemplate: require(path.join(__dirname, 'data/templates/html/activationFailTemplate.html'), 'utf8'),
//             activationSuccessTemplate: require(path.join(__dirname, '/data/templates/html/activationSuccessTemplate.html'), 'utf8'),
//             activationEmailTemplate: require(path.join(__dirname, 'data/templates/html/activationEmailTemplate.html'), 'utf8'),
//         }
//     };
// })();

module.exports = {
    service,
    //data
};

},{"./api":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/email/api/index.js","fs":false,"path":false}],"assistos-sdk/modules/space":[function(require,module,exports){
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
            const data = require('./data/templates/json/defaultApiKeyTemplate.json');
            Object.defineProperty(dataModules, 'defaultApiKeyTemplate', {
                value: data,
                writable: false,
                configurable: true
            });
            return data;
        },
        get defaultSpaceAnnouncement() {
            const data = require('./data/templates/json/defaultSpaceAnnouncement.json');
            Object.defineProperty(dataModules, 'defaultSpaceAnnouncement', {
                value: data,
                writable: false,
                configurable: true
            });
            return data;
        },
        get defaultSpaceTemplate() {
            const data = require('./data/templates/json/defaultSpaceTemplate.json');
            Object.defineProperty(dataModules, 'defaultSpaceTemplate', {
                value: data,
                writable: false,
                configurable: true
            });
            return data;
        },
        get defaultSpaceNameTemplate() {
            const data = require('./data/templates/json/defaultSpaceNameTemplate.json');
            Object.defineProperty(dataModules, 'defaultSpaceNameTemplate', {
                value: data,
                writable: false,
                configurable: true
            });
            return data;
        },
        get spaceValidationSchema() {
            const data = require('./data/templates/spaceValidationSchema.json');
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


},{"./apis":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/space/apis/index.js","./data/templates/json/defaultApiKeyTemplate.json":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/space/data/templates/json/defaultApiKeyTemplate.json","./data/templates/json/defaultSpaceAnnouncement.json":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/space/data/templates/json/defaultSpaceAnnouncement.json","./data/templates/json/defaultSpaceNameTemplate.json":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/space/data/templates/json/defaultSpaceNameTemplate.json","./data/templates/json/defaultSpaceTemplate.json":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/space/data/templates/json/defaultSpaceTemplate.json","./data/templates/spaceValidationSchema.json":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/space/data/templates/spaceValidationSchema.json"}],"assistos-sdk/modules/user":[function(require,module,exports){
const apiModules = {
    get user() {
        const module = require('./apis');
        Object.defineProperty(apiModules, 'userApis', { value: module, writable: false, configurable: true });
        return module;
    }
};

const dataModules = {
    templates: {
        get defaultApiKeyTemplate() {
            const data = require('./data/templates/json/defaultApiKeyTemplate.json');
            Object.defineProperty(dataModules, 'defaultApiKeyTemplate', {
                value: data,
                writable: false,
                configurable: true
            });
            return data;
        },
        get defaultUserTemplate() {
            const data = require('./data/templates/json/defaultUserTemplate.json');
            Object.defineProperty(dataModules, 'defaultUserTemplate', {
                value: data,
                writable: false,
                configurable: true
            });
            return data;
        },
        get demoUser() {
            const data = require('./data/templates/json/demoUser.json');
            Object.defineProperty(dataModules, 'demoUser', {value: data, writable: false, configurable: true});
            return data;
        },
        get userRegistrationTemplate() {
            const data = require('./data/templates/json/userRegistrationTemplate.json');
            Object.defineProperty(dataModules, 'userRegistrationTemplate', {
                value: data,
                writable: false,
                configurable: true
            });
            return data;
        }
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

},{"./apis":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/user/apis/index.js","./data/templates/json/defaultApiKeyTemplate.json":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/user/data/templates/json/defaultApiKeyTemplate.json","./data/templates/json/defaultUserTemplate.json":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/user/data/templates/json/defaultUserTemplate.json","./data/templates/json/demoUser.json":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/user/data/templates/json/demoUser.json","./data/templates/json/userRegistrationTemplate.json":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/user/data/templates/json/userRegistrationTemplate.json"}],"assistos-sdk/modules/util":[function(require,module,exports){
const apiModules = {
    get crypto() {
        const module = require('./apis/crypto.js');
        Object.defineProperty(this, 'crypto', { value: module, writable: false, configurable: true });
        return module;
    },
    get data() {
        const module = require('./apis/data.js');
        Object.defineProperty(this, 'data', { value: module, writable: false, configurable: true });
        return module;
    },
    get date() {
        const module = require('./apis/date.js');
        Object.defineProperty(this, 'date', { value: module, writable: false, configurable: true });
        return module;
    },
    get file() {
        const module = require('./apis/file.js');
        Object.defineProperty(this, 'file', { value: module, writable: false, configurable: true });
        return module;
    },
    get openAI() {
        const module = require('./apis/openAI.js');
        Object.defineProperty(this, 'openAI', { value: module, writable: false, configurable: true });
        return module;
    }
};

const data = {};

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
},{"./apis/crypto.js":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/util/apis/crypto.js","./apis/data.js":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/util/apis/data.js","./apis/date.js":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/util/apis/date.js","./apis/file.js":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/util/apis/file.js","./apis/openAI.js":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/util/apis/openAI.js"}],"assistos-sdk":[function(require,module,exports){
module.exports = {
    loadModule: function(moduleName) {
        switch (moduleName) {
            case 'util':
                return require('./modules/util');
            case 'document':
                return require('./modules/document');
            case 'space':
                return require('./modules/space');
            case 'user':
                return require('./modules/user');
            case 'services':
                return require('./modules/email');
            default:
                return null;
        }
    },
    constants: require('./constants.js'),
};

},{"./constants.js":"/home/mircea/Desktop/assistOS/assistos-sdk/constants.js","./modules/document":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/document/index.js","./modules/email":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/email/index.js","./modules/space":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/space/index.js","./modules/user":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/user/index.js","./modules/util":"/home/mircea/Desktop/assistOS/assistos-sdk/modules/util/index.js"}]},{},["/home/mircea/Desktop/assistOS/assistos-sdk/builds/tmp/assistOS_intermediar.js"])
                    ;(function(global) {
                        global.bundlePaths = {"assistOS":"build/bundles/assistOS.js"};
                    })(typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
                