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
        this.comment = chapterData.comment || "";
        this.commands = chapterData.commands || {};
    }
    async refreshParagraph(spaceId, documentId, paragraphId){
        const documentModule = require("assistos").loadModule("document", {});
        let paragraphData = await documentModule.getParagraph(assistOS.space.id, documentId, paragraphId);
        let paragraphIndex = this.paragraphs.findIndex(paragraph => paragraph.id === paragraphId);
        this.paragraphs[paragraphIndex] = new Paragraph(paragraphData);
        return this.paragraphs[paragraphIndex];
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
    swapParagraphs(paragraphId1, paragraphId2) {
        let index1 = this.paragraphs.findIndex(paragraph => paragraph.id === paragraphId1);
        let index2 = this.paragraphs.findIndex(paragraph => paragraph.id === paragraphId2);
        if(index1 !== -1 && index2 !== -1) {
            [this.paragraphs[index1], this.paragraphs[index2]] = [this.paragraphs[index2], this.paragraphs[index1]];
            return true;
        }else{
            console.error("Attempting to swap paragraphs that no longer exist in this chapter.");
            return false;
        }
    }
}
module.exports = Chapter;
