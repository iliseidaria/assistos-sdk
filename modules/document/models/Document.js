const Chapter = require("./Chapter.js");
const constants = require("../../../constants");
class Document {
    constructor(documentData) {
        this.id = documentData.id;
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
    async refreshChapter(documentId, chapterId) {
        const documentModule = require("assistos").loadModule("document", {});
        const chapter = await documentModule.getChapter(assistOS.space.id, documentId, chapterId);
        let chapterIndex = this.chapters.findIndex(chapter => chapter.id === chapterId);
        if (chapterIndex !== -1) {
            this.chapters[chapterIndex] = new Chapter(chapter);
            return this.chapters[chapterIndex];
        } else {
            console.warn(`${chapterId} not found`);
            return null;
        }
    }
    getChapterIndex(chapterId) {
        return this.chapters.findIndex(chapter => chapter.id === chapterId);
    }
    swapChapters(chapterId1, chapterId2) {
        let chapter1Index = this.chapters.findIndex(chapter => chapter.id === chapterId1);
        let chapter2Index = this.chapters.findIndex(chapter => chapter.id === chapterId2);
        if (chapter1Index !== -1 && chapter2Index !== -1) {
            [this.chapters[chapter1Index], this.chapters[chapter2Index]] = [this.chapters[chapter2Index], this.chapters[chapter1Index]];
            return true;
        } else {
            console.warn("Attempting to swap chapters that no longer exist in this document.");
            return false;
        }
    }
}
module.exports = Document;
