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
    TTS_COMMANDS: [
        {
            NAME: "!speech",
            ACTION: "textToSpeech",
            PARAMETERS: [{
                NAME: "personality",
                TYPE: "string",
            }, {
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
                    'male_surprised'],
            },
            {
                NAME: "styleGuidance",
                TYPE: "number",
                MIN_VALUE: 0,
                MAX_VALUE: 100,
            }, {
                NAME: "temperature",
                TYPE: "number",
                MIN_VALUE: 0,
                MAX_VALUE: 100,
            }, {
                NAME: "voiceGuidance",
                TYPE: "number",
                MIN_VALUE: 0,
                MAX_VALUE: 100,
            }
            ]
        },
        {
            NAME: "!silence",
            ACTION: "addPauseInAudio",
            PARAMETERS: [{
                NAME:"duration",
                TYPE:"number",
                MIN_VALUE:0,
                MAX_VALUE:100,
            }]
            //duration is in seconds
        }
    ]
}