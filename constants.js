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
            "lipsync"
        ],
        COMMANDS: [
            {
                NAME: "speech",
                ACTION: "textToSpeech",//scos
                ALLOWED_ALONG: ["lipsync", "video"],
                VALIDATE: async (spaceId, documentId, paragraphId, securityContext) => {
                    const documentModule = require('assistos').loadModule('document', securityContext);
                    const personalityModule = require('assistos').loadModule('personality', securityContext);

                    const paragraph = await documentModule.getParagraph(spaceId, documentId, paragraphId);

                    if (!paragraph) {
                        throw ("Paragraph not found");
                    }
                    if (paragraph.text.trim() === "") {
                        throw ("Paragraph text is empty");
                    }
                    if (!paragraph.commands["speech"]) {
                        throw ("Paragraph Must have a speech command");
                    }
                    const speechPersonality = paragraph.commands["speech"].paramsObject.personality;
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
                PARAMETERS: [
                    {
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

                    if (paragraph.commands["speech"]) {
                        const speechCommand = paragraph.commands["speech"];
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
        ],
        ATTACHMENTS: [
            {
                NAME: "audio",
                PARAMETERS: [
                    {
                        NAME: "id",
                        TYPE: "string",
                    },
                ],
                VALIDATE: async (spaceId, resourceId, securityContext) => {
                    const spaceModule = require('assistos').loadModule('space', securityContext);
                    const audio = await spaceModule.getAudioHead(spaceId, resourceId);
                    if (!audio) {
                        throw ("Invalid audio Id");
                    }

                }
            },
            {
                NAME: "video",
                PARAMETERS: [
                    {
                        NAME: "id",
                        TYPE: "string",
                    },
                ],
                VALIDATE: async (spaceId, resourceId, securityContext) => {
                    const spaceModule = require('assistos').loadModule('space', securityContext);
                    const video = await spaceModule.getVideoHead(spaceId, resourceId);
                    if (!video) {
                        throw ("Invalid video Id");
                    }

                }
            },
            {
                NAME: "image",
                PARAMETERS: [
                    {
                        NAME: "id",
                        TYPE: "string",
                    },
                    {
                        NAME: "width",
                        TYPE: "number",
                        MIN_VALUE: 100,
                        MAX_VALUE: 1920
                    }, {
                        NAME: "height",
                        TYPE: "number",
                        MIN_VALUE: 100,
                        MAX_VALUE: 1080
                    }
                ],
                VALIDATE: async (spaceId, resourceId, securityContext) => {
                    const spaceModule = require('assistos').loadModule('space', securityContext);
                    const image = await spaceModule.getImageHead(spaceId, resourceId);
                    if (!image) {
                        throw ("Invalid image Id");
                    }

                }
            }
        ]
    },
    IMAGE_SRC_PREFIX: "spaces/image/",
    AUDIO_SRC_PREFIX: "spaces/audio/",
    VIDEO_SRC_PREFIX: "spaces/video/"
}

