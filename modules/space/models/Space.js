const Application = require("../../application/models/Application.js");
const Announcement = require("./Announcement.js");

class Space {
    constructor(spaceData) {
        this.name = spaceData.name
        this.id = spaceData.id
        this.announcements = (spaceData.announcements || []).map(announcementData => new Announcement(announcementData));
        this.users = spaceData.users || [];
        this.flows = [];
        this.admins = [];
        this.chat = spaceData.chat
        this.pages = spaceData.pages || [];
        /* TODO REFACTOR METADATA LOGIC for personalities and include default personality in the space object */
        this.currentPersonalityId = spaceData.currentPersonalityId;
        this.observers = [];
        this.installedApplications = (spaceData.installedApplications || []).map(applicationData => new Application(applicationData));
        // TODO use proper singleton pattern
        Space.instance = this;
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
    getNotificationId() {
        return "space";
    }

    getApplicationByName(name) {
        let app = this.installedApplications.find((app) => app.name === name);
        return app || console.error(`installed app not found in space, id: ${name}`);
    }

}
module.exports = Space;