module.exports = {
    DEFAULT_PERSONALITY: "Assistant",
    USER_LOGIN_PLUGIN: "UserLogin",
    SPACE_PLUGIN: "SpacePlugin",
    APPLICATION_PLUGIN: "ApplicationPlugin",
    AGENT_PLUGIN: "AgentWrapper",
    APP_SPECIFIC_PLUGIN: "AppSpecificPlugin",
    WORKSPACE_PLUGIN: "Workspace",
    DOCUMENTS_PLUGIN: "Documents",
    WORKSPACE_USER_PLUGIN: "WorkspaceUser",
    SPACE_INSTANCE_PLUGIN: "SpaceInstancePlugin",
    CHAT_PLUGIN: "ChatPlugin",
    LLM_PLUGIN: "LLM",
    WEB_ASSISTANT_PLUGIN:"WebAssistant",
    FFMPEG_PLUGIN: "FfmpegPlugin",
    GLOBAL_SERVERLESS_ID: "assistOS",
    DOCUMENT_CATEGORIES: {
        SNAPSHOT: 'snapshot',
        DOCUMENT: 'document',
        CHAT: 'chat',
        SCRIPT_EXECUTION: 'Script_Execution'
    },
    DEFAULT_AGENT_NAME: "Assistant",
    DEFAULT_ID_LENGTH: 16,
    ENV_TYPE: {
        NODE: "node",
        BROWSER: "browser",
        UNKNOWN: "unknown"
    },
    ENVIRONMENT_MODE: "DEVELOPMENT_BASE_URL",
    PRODUCTION_BASE_URL: "http://demo.assistos.net:8080",
    DEVELOPMENT_BASE_URL: "http://localhost:8080"
}

