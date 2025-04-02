class Paragraph {
    constructor(paragraphData) {
        this.position = paragraphData.position;
        this.id = paragraphData.id;
        this.text = paragraphData.text || "";
        this.mainIdea = paragraphData.mainIdea || "";
        this.alternativeParagraphs = paragraphData.alternativeParagraphs || [];
        this.commands = paragraphData.commands || "";
        this.comments = paragraphData.comments || "";
        this.type = paragraphData.type;
    }

    getNotificationId(chapterId) {
        return `doc:${chapterId}:${this.id}`;
    }

    toString() {
        return this.text;
    }
}

module.exports = Paragraph;
