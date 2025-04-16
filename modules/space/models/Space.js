let singleton = null;
class Space {
    constructor(spaceData) {
        this.name = spaceData.name
        this.id = spaceData.id
        this.announcements = [];
        this.chat = spaceData.chat;
        this.currentPersonalityId = spaceData.currentPersonalityId;
        this.observers = [];
    }

    static getInstance(data) {
        if (!singleton) {
            singleton = new Space(data);
        }
        return singleton;
    }


}

module.exports = {
    getInstance: function (data) {
        return Space.getInstance(data);
    },
};