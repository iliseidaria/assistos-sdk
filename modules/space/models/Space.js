const Personality = require("../../personality/models/Personality.js");
const Application = require("../../application/models/Application.js");
const Announcement = require("./Announcement.js");
const LLM = require("../../llm/models/LLM.js");
class Space {
    constructor(spaceData) {
        this.name = spaceData.name || undefined;
        this.id = spaceData.id || undefined;
        this.announcements = (spaceData.announcements || []).map(announcementData => new Announcement(announcementData));
        this.users = spaceData.users || [];
        this.flows = [];
        this.admins = [];
        this.chat = spaceData.chat
        this.apiKeys = spaceData.apiKeys || {};
        this.pages = spaceData.pages || [];
        /* TODO REFACTOR METADATA LOGIC for personalities nnd include default personality in the space object */
        this.currentPersonalityId = spaceData.currentPersonalityId //|| this.personalities.find(personality => personality.id === constants.PERSONALITIES.DEFAULT_PERSONALITY_ID).id;
        this.llms = spaceData.llms || [{name:"GPT 3.5 Turbo",id:"q12437rgq39r845t"}, {name:"GPT 4",id:"q124wsreg"}].map(llm => new LLM(llm));
        this.currentLlmId = spaceData.currentLlmId || "q12437rgq39r845t";
        this.observers = [];
        this.installedApplications = (spaceData.installedApplications || []).map(applicationData => new Application(applicationData));
        Space.instance = this;
    }

    async simplifySpace() {
        return {
            name: this.name,
            id: this.id,
            personalities: this.personalities.map(personality => personality.simplify()),
            announcements: this.announcements.map(announcement => announcement.simplify()),
            installedApplications: this.installedApplications.map(application => application.stringifyApplication()),
            apiKeys:this.apiKeys,
            documents: await this.getDocumentsMetadata(),
        }
    }

    getSpaceStatus() {
        return {
            name: this.name,
            id: this.id,
            admins: this.admins,
            users:this.users,
            announcements: this.announcements,
            currentPersonalityId: this.currentPersonalityId,
            installedApplications: this.installedApplications.map(app => app.stringifyApplication()),
            apiKeys:this.apiKeys
        }
    }
    async getPersonalitiesMetadata(){
        const personalityModule = require("assistos").loadModule("personality", {});
        this.personalitiesMetadata = await personalityModule.getPersonalitiesMetadata(this.id);
        return this.personalitiesMetadata;
    }
    getKey(keyType,keyId){
        return this.apiKeys[keyType].find(key=>key.id===keyId)||null;
    }
    async getDocumentsMetadata(){
        let documentModule = require("assistos").loadModule("document", {});
        return await documentModule.getDocumentsMetadata(this.id);
    }
    observeChange(elementId, callback, callbackAsyncParamFn) {
        let obj = {elementId: elementId, callback: callback, param: callbackAsyncParamFn};
        callback.refferenceObject = obj;
        this.observers.push(new WeakRef(obj));

    }

    notifyObservers(prefix) {
        this.observers = this.observers.reduce((accumulator, item) => {
            if (item.deref()) {
                accumulator.push(item);
            }
            return accumulator;
        }, []);
        for (const observerRef of this.observers) {
            const observer = observerRef.deref();
            if (observer && observer.elementId.startsWith(prefix)) {
                observer.callback(observer.param);
            }
        }
    }
    getLLM(){
        return this.llms.find(llm=> llm.id === this.currentLlmId);
    }
    setLlm(llmId){
        this.currentLlmId = llmId;
    }

    getNotificationId() {
        return "space";
    }

    getAnnouncement(announcementId) {
        let announcement = this.announcements.find((announcement) => announcement.id === announcementId);
        return announcement || console.error(`Announcement not found, announcementId: ${announcementId}`);
    }

    async loadApplicationsFlows() {
        for (let app of this.installedApplications) {
            await app.loadFlows(this.id);
        }
    }

    getApplication(id) {
        let app = this.installedApplications.find((app) => app.id === id);
        return app || console.error(`installed app not found in space, id: ${id}`);
    }

    getApplicationByName(name) {
        let app = this.installedApplications.find((app) => app.name === name);
        return app || console.error(`installed app not found in space, id: ${name}`);
    }
    getAllFlows() {
        let flows = [];
        for (let app of this.installedApplications) {
            flows = flows.concat(app.flows);
        }
        flows = flows.concat(this.flows);
        //removes duplicates by name
        flows = flows.filter((element, index, self) => {
            return index === self.findIndex(e => e.name === element.name);
        });
        return flows;
    }

    async getFlow(flowName) {
        let flow = this.flows.find(flow => flow.name === flowName);
        return flow || console.error(`Flow not found, flowName: ${flowName}`);
    }

    async getPersonality(id) {
        const personalityModule = require("assistos").loadModule("personality", {});
        let personalityData = await personalityModule.getPersonality(this.id, id);
        return new Personality(personalityData);
    }

    async loadFlows() {
        const flowModule = require("assistos").loadModule("flow", {});
        this.flows = [];
        let flows = await flowModule.loadFlows(this.id);
        for (let [name, flowClass] of Object.entries(flows)) {
            this.flows.push(flowClass);
        }
        return this.flows;
    }
}
module.exports = Space;