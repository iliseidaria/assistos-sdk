module.exports = {
    DEFAULT_ID_LENGTH: 16,
    DEFAULT_PERSONALITY_NAME: "Assistant",
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
            "audio",
            "image",
            "video",
            "speech",
            "silence",
            "lipsync"
        ],
        EMOTIONS : {
            'female_happy': 'Female Happy',
            'female_sad': 'Female Sad',
            'female_angry': 'Female Angry',
            'female_fearful': 'Female Fearful',
            'female_disgust': 'Female Disgust',
            'female_surprised': 'Female Surprised',
            'male_happy': 'Male Happy',
            'male_sad': 'Male Sad',
            'male_angry': 'Male Angry',
            'male_fearful': 'Male Fearful',
            'male_disgust': 'Male Disgust',
            'male_surprised': 'Male Surprised'
        },
        COMMANDS: [
            {
                NAME: "speech",
                ALLOWED_ALONG: ["lipsync", "videoScreenshot"],
                VALIDATE: async (spaceId, paragraph, securityContext) => {
                    const personalityModule = require('assistos').loadModule('personality', securityContext);

                    if (!paragraph) {
                        throw ("Paragraph not found");
                    }
                    if (paragraph.text.trim() === "") {
                        throw ("Paragraph text is empty");
                    }
                    if (!paragraph.commands["speech"]) {
                        throw ("Paragraph Must have a speech command");
                    }
                    const speechPersonality = paragraph.commands["speech"].personality;
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
                        REQUIRED: true,
                        NAME: "personality",
                        SHORTHAND: "p",
                        TYPE: "string",
                    },
                    {
                        REQUIRED: true,
                        NAME: "emotion",
                        SHORTHAND: "e",
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
                    }, {
                        NAME: "styleGuidance",
                        SHORTHAND: "sg",
                        TYPE: "number",
                        MIN_VALUE: 0,
                        MAX_VALUE: 100
                    }, {
                        NAME: "temperature",
                        SHORTHAND: "t",
                        TYPE: "number",
                        MIN_VALUE: 0,
                        MAX_VALUE: 100
                    }, {
                        NAME: "voiceGuidance",
                        SHORTHAND: "vg",
                        TYPE: "number",
                        MIN_VALUE: 0,
                        MAX_VALUE: 100
                    },{
                        NAME: "taskId",
                        SHORTHAND: "t",
                        TYPE: "string"
                    }
                ]
            },
            {
                NAME: "silence",
                ALLOWED_ALONG: ["videoScreenshot"],
                PARAMETERS:
                    [{
                        NAME: "duration",
                        SHORTHAND: "d",
                        TYPE: "number",
                        MIN_VALUE: 1,
                        MAX_VALUE: 3600,
                    }],
                VALIDATE: async function () {
                    return true;
                }
            },
            {
                NAME: "lipsync",
                ALLOWED_ALONG: ["speech", "videoScreenshot"],
                REQUIRED: ["speech"],
                VALIDATE: async (spaceId, paragraph, securityContext) => {
                    if (!paragraph.commands.speech) {
                        throw ("Paragraph Must have a speech command before adding lip sync");
                    }
                    if (!paragraph.commands.image && !paragraph.commands.video) {
                        throw ("Paragraph Must have an image or a video before adding lip sync");
                    }
                },
                EXECUTE: async (spaceId, documentId, paragraphId, securityContext) => {
                    const documentModule = require('assistos').loadModule('document', securityContext);
                    return await documentModule.generateParagraphLipSync(spaceId, documentId, paragraphId);
                },
                PARAMETERS: [{
                    NAME: "taskId",
                    SHORTHAND: "t",
                    TYPE: "string"
                }]
            },
            {
                NAME: "audio",
                PARAMETERS: [
                    {
                        NAME: "id",
                        TYPE: "string",
                    },
                    {
                        NAME: "duration",
                        TYPE: "number",
                        MIN_VALUE: 0,
                        MAX_VALUE: 3600
                    }
                ],
                VALIDATE: async (spaceId, resourceId, securityContext) => {
                    /*  const spaceModule = require('assistos').loadModule('space', securityContext);
                      const audio = await spaceModule.getAudioHead(spaceId, resourceId);
                      if (!audio) {
                          throw ("Invalid audio Id");
                      }*/
                }
            },
            {
                NAME: "video",
                PARAMETERS: [
                    {
                        NAME: "id",
                        TYPE: "string",
                    },
                    {
                        NAME: "width",
                        TYPE: "number",
                        MIN_VALUE: 1,
                        MAX_VALUE: 10920
                    }, {
                        NAME: "height",
                        TYPE: "number",
                        MIN_VALUE: 1,
                        MAX_VALUE: 10080
                    },
                    {
                        NAME: "duration",
                        TYPE: "number",
                        MIN_VALUE: 0,
                        MAX_VALUE: 3600
                    }
                ],
                VALIDATE: async (spaceId, resourceId, securityContext) => {
                    /*       const spaceModule = require('assistos').loadModule('space', securityContext);
                           const video = await spaceModule.getVideoHead(spaceId, resourceId);
                           if (!video) {
                               throw ("Invalid video Id");
                           }*/
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
                        MIN_VALUE: 20,
                        MAX_VALUE: 8000
                    }, {
                        NAME: "height",
                        TYPE: "number",
                        MIN_VALUE: 20,
                        MAX_VALUE: 8000
                    }
                ],
                VALIDATE: async (spaceId, resourceId, securityContext) => {
                    /*     const spaceModule = require('assistos').loadModule('space', securityContext);
                         const image = await spaceModule.getImageHead(spaceId, resourceId);
                         if (!image) {
                             throw ("Invalid image Id");
                         }*/
                }
            }
        ]
    },
    getImageSrc: (spaceId, imageId) => {
        return `spaces/image/${spaceId}/${imageId}`;
    },
    getAudioSrc: (spaceId, audioId) => {
        return `spaces/audio/${spaceId}/${audioId}`;
    },
    getVideoSrc: (spaceId, videoId) => {
        return `spaces/video/${spaceId}/${videoId}`;
    }
}

