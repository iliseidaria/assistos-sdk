module.exports = {
    DEFAULT_ID_LENGTH: 16,
    PERSONALITIES: {
        DEFAULT_PERSONALITY_NAME: "Assistant",
        DEFAULT_PERSONALITY_ID: "2idYvpTEKXM5",
    },
    ENV_TYPE: {
        NODE: "node",
        BROWSER: "browser",
        UNKNOWN: "unknown"
    },
    ENVIRONMENT_MODE: "DEVELOPMENT_BASE_URL",
    PRODUCTION_BASE_URL: "http://demo.assistos.net:8080",
    DEVELOPMENT_BASE_URL: "http://localhost:8080",
    COMMANDS_CONFIG: {
        ORDER: [
            "speech",
            "silence",
            "video",
            "lipsync"
        ],
        COMMANDS: [
            {
                NAME: "speech",
                ACTION: "textToSpeech",
                ALLOWED_ALONG: ["lipsync", "video"],
                REQUIRED: [],
                VALIDATE: async (spaceId, documentId, paragraphId, securityContext) => {
                    const documentModule = require('assistos').loadModule('document', securityContext);
                    const personalityModule = require('assistos').loadModule('personality', securityContext);

                    const paragraph = await documentModule.getParagraph(spaceId, documentId, paragraphId);

                    if (!paragraph) {
                        throw ("Paragraph not found");
                    }
                    if (!paragraph.config.commands["speech"]) {
                        throw ("Paragraph Must have a speech command");
                    }
                    const speechPersonality = paragraph.config.commands["speech"].paramsObject.personality;
                    const personalityData = await personalityModule.getPersonalityByName(spaceId, speechPersonality);
                    if (!personalityData) {
                        throw `Personality ${speechPersonality} not found`;
                    }
                    if (!personalityData.voiceId) {
                        throw `Personality ${speechPersonality} has no voice configured`;
                    }

                },
                EXECUTE: async (spaceId, documentId, paragraphId, securityContext) => {
                    const documentModule = require('assistos').loadModule('document', securityContext);
                    return await documentModule.generateParagraphAudio(spaceId, documentId, paragraphId);

                },
                PARAMETERS: [{
                    NAME: "personality",
                    TYPE: "string",
                },
                    {
                        NAME: "emotion",
                        TYPE: "string",
                        VALUES: ['female_happy',
                            'female_sad',
                            'female_angry',
                            'female_fearful',
                            'female_disgust',
                            'female_surprised',
                            'male_happy',
                            'male_sad',
                            'male_angry',
                            'male_fearful',
                            'male_disgust',
                            'male_surprised']
                    }
                    , {
                        NAME: "styleGuidance",
                        TYPE: "number",
                        MIN_VALUE: 0,
                        MAX_VALUE: 100
                    }, {
                        NAME: "temperature",
                        TYPE: "number",
                        MIN_VALUE: 0,
                        MAX_VALUE: 100
                    }, {
                        NAME: "voiceGuidance",
                        TYPE: "number",
                        MIN_VALUE: 0,
                        MAX_VALUE: 100
                    }
                ]
            },
            {
                NAME: "silence",
                ALLOWED_ALONG: ["video"],
                ACTION:
                    "createSilentAudio",
                PARAMETERS:
                    [{
                        NAME: "duration",
                        TYPE: "number",
                        MIN_VALUE: 0,
                        MAX_VALUE: 100,
                    }]
            },
            {
                NAME: "video",
                ALLOWED_ALONG: ["lipsync", "speech", "silence"],
                REQUIRED: ["speech"],
                VALIDATE: async (spaceId, documentId, paragraphId, commandStatus, commandObj, securityContext) => {
                },
                ACTION: "createVideo"
            },
            {
                NAME: "lipsync",
                ALLOWED_ALONG: ["video", "speech"],
                REQUIRED: ["speech"],
                VALIDATE: async (spaceId, documentId, paragraphId, securityContext) => {
                    const utilModule = require('assistos').loadModule('util', securityContext);
                    const documentModule = require('assistos').loadModule('document', securityContext);

                    const paragraph = await documentModule.getParagraph(spaceId, documentId, paragraphId);

                    if (!paragraph) {
                        throw ("Paragraph not found");
                    }

                    if (paragraph.config.commands["speech"]) {
                        const speechCommand = paragraph.config.commands["speech"];
                        if (speechCommand.taskId) {
                            let task = await utilModule.getTask(speechCommand.taskId);
                            switch (task.status) {
                                case "running":
                                    throw ("Cannot lipSync paragraph while speech command is running");
                                case "created":
                                    throw ("Cannot lipSync paragraph before speech task is executed");
                                case "canceled":
                                    throw ("Cannot lipSync paragraph because speech task was canceled");
                                case "failed":
                                    throw ("Cannot lipSync paragraph because speech task failed");
                                case "completed":
                                    return;
                            }
                        }
                    } else {
                        throw ("Paragraph Must have a speech command before adding a lip sync command");
                    }
                },
                EXECUTE: async (spaceId, documentId, paragraphId, securityContext) => {
                    const documentModule = require('assistos').loadModule('document', securityContext);
                    return await documentModule.generateParagraphLipSync(spaceId, documentId, paragraphId);
                },
                ACTION:
                    "createLipSync"
            },
        ]
    }
}
