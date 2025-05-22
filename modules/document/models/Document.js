const Chapter = require("./Chapter.js");
const constants = require("../../../constants");
class Document {
    constructor(documentData) {
        this.id = documentData.id;
        this.docId = documentData.docId;
        this.title = documentData.title || "";
        this.infoText = documentData.infoText || "";
        this.category = documentData.category || constants.DOCUMENT_CATEGORIES.DOCUMENT;
        this.chapters = (documentData.chapters || []).map(chapterData => new Chapter(chapterData));
        this.video = documentData.video || "";
        this.comments = documentData.comments || "";
        this.commands = documentData.commands || "";
    }

    toString() {
        return this.chapters.map(chapter => chapter.toString()).join("\n\n") || "";
    }
    getChapter(chapterId) {
        return this.chapters.find(chapter => chapter.id === chapterId);
    }

    getChapterIndex(chapterId) {
        return this.chapters.findIndex(chapter => chapter.id === chapterId);
    }
}
module.exports = Document;
