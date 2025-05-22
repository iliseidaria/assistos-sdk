const Paragraph = require("./Paragraph.js");
class Chapter {
    constructor(chapterData) {
        this.position = chapterData.position;
        this.title = chapterData.title;
        this.id = chapterData.id;
        this.visibility = chapterData.visibility || "show";
        this.paragraphs = (chapterData.paragraphs || []).map(paragraphData => new Paragraph(paragraphData));
        this.idea = chapterData.idea || "";
        this.mainIdeas = chapterData.mainIdeas || [];
        this.comments = chapterData.comments || "";
        this.commands = chapterData.commands || "";
    }

    deleteParagraph(paragraphId) {
        let paragraphIndex = this.paragraphs.findIndex(paragraph => paragraph.id === paragraphId);
        if(paragraphIndex !== -1) {
            this.paragraphs.splice(paragraphIndex, 1);
        }else{
            console.error("Attempting to delete paragraph that no longer exists in this chapter.");
        }
    }

    getParagraph(paragraphId) {
        return this.paragraphs.find(paragraph => paragraph.id === paragraphId) || null;
    }
    getParagraphIndex(paragraphId) {
        return this.paragraphs.findIndex(paragraph => paragraph.id === paragraphId);
    }
}
module.exports = Chapter;
