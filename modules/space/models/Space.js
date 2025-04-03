const Announcement = require("./Announcement.js");
let singleton = null;
class Space {
    constructor(spaceData) {
        this.name = spaceData.name
        this.id = spaceData.id
        this.announcements = (spaceData.announcements || []).map(announcementData => new Announcement(announcementData));
        this.chat = spaceData.chat;
        /* TODO REFACTOR METADATA LOGIC for personalities and include default personality in the space object */
        this.currentPersonalityId = spaceData.currentPersonalityId;
        this.observers = [];
    }
    static getInstance(data) {
        if (!singleton) {
            singleton = new Space(data);
        }
        return singleton;
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

}

module.exports = {
    getInstance: function (data) {
        return Space.getInstance(data);
    },
};