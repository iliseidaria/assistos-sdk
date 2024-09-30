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
            "speech",
            "silence",
            "lipsync"
        ],
        EMOJIS : {
            'female_happy': '👩😊',
            'female_sad': '👩😢',
            'female_angry': '👩😡',
            'female_fearful': '👩😨',
            'female_disgust': '👩🤢',
            'female_surprised': '👩😲',
            'male_happy': '👨😊',
            'male_sad': '👨😢',
            'male_angry': '👨😡',
            'male_fearful': '👨😨',
            'male_disgust': '👨🤢',
            'male_surprised': '👨😲'
        },
        COMMANDS: [
            {
                NAME: "speech",
                ACTION: "textToSpeech",//scos
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
                        SHORTHAND: "p",
                        TYPE: "string",
                    },
                    {
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
                    }
                    , {
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
                    }
                ]
            },
            {
                NAME: "silence",
                ALLOWED_ALONG: ["videoScreenshot"],
                ACTION:
                    "createSilentAudio",
                PARAMETERS:
                    [{
                        NAME: "duration",
                        SHORTHAND: "d",
                        TYPE: "number",
                        MIN_VALUE: 0,
                        MAX_VALUE: 100,
                    }],
                VALIDATE: async function () {
                    return true;
                }
            },
            {
                NAME: "videoScreenshot",
                ALLOWED_ALONG: ["speech", "silence"],
                PARAMETERS:
                    [{
                        NAME: "inputId",
                        SHORTHAND: "i",
                        TYPE: "string",
                     },{
                        NAME: "time",
                        SHORTHAND: "t",
                        TYPE: "number",
                        MIN_VALUE: 0,
                        MAX_VALUE: 999,
                    },{
                        NAME: "outputId",
                        SHORTHAND: "o",
                        TYPE: "string",
                    }],
                VALIDATE: async (spaceId, resourceId, paragraph) => {
                 /*const spaceModule = require('assistos').loadModule('space', securityContext);
                   const video = await spaceModule.getVideoHead(spaceId, resourceId);
                   if (!video) {
                       throw ("Invalid video Id");
                   }*/
                    if(!paragraph.commands.videoScreenshot.paramsObject.time > paragraph.commands.video.duration){
                        throw ("Time should be less than video duration");
                    }
                },
                EXECUTE: async (spaceId, documentId, paragraphId, securityContext) => {
                    const documentModule = require('assistos').loadModule('document', securityContext);
                    return await documentModule.addVideoScreenshot(spaceId, documentId, paragraphId);
                },
                ACTION: "videoScreenshot"
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
                ACTION:
                    "createLipSync"
            }
        ],
        ATTACHMENTS: [
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

