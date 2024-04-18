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