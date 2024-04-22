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
        },
        car:{
            front:{
                type: "object",
                properties:{
                    steeringWheel: {
                        type: "array",
                        items: {
                            material: "string",
                            buttons: "number",
                            color: "string",
                            heating: "array"
                        }
                    },
                    doors: "number",
                    seats: "number"
                }
            },
            back:{
                type: "object",
                properties:{
                    doors: "number",
                    seats: "number"
                }
            }
        }
    },
    DEFAULT_ID_LENGTH: 16
}