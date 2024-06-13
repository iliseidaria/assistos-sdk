const IFlow = require("./models/IFlow.js");
const request = require("../util").request;
const constants = require("../../constants.js");

async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}

async function listFlows(spaceId) {
    return await this.sendRequest(`/flows/${spaceId}`, "GET");
}

async function getFlow(spaceId, flowName) {
    return await import(`/flows/${spaceId}/${flowName}`);
}

async function addFlow(spaceId, flowData) {
    return await this.sendRequest(`/flows/${spaceId}`, "POST", flowData)
}

async function updateFlow(spaceId, flowName, flowData) {
    return await this.sendRequest(`/flows/${spaceId}/${flowName}`, "PUT", flowData)
}

async function deleteFlow(spaceId, flowName) {
    return await this.sendRequest(`/flows/${spaceId}/${flowName}`, "DELETE")
}

async function callServerFlow(spaceId, flowName, context, personalityId) {
    return await this.sendRequest(`/flows/call/${spaceId}/${flowName}`, "POST", {
        context: context,
        personalityId: personalityId
    });
}

async function callFlow(spaceId, flowName, context, personalityId) {
    const envType = require("assistos").envType;
    if (envType === constants.ENV_TYPE.NODE) {
        return await callServerFlow(spaceId, flowName, context, personalityId);
    } else if (envType === constants.ENV_TYPE.BROWSER) {
        let flowInstance;
        if (assistOS.currentApplicationName === assistOS.configuration.defaultApplicationName) {
            flowInstance = await assistOS.space.getFlow(flowName);
        } else {
            let app = assistOS.space.getApplicationByName(assistOS.currentApplicationName);
            flowInstance = app.getFlow(flowName);
        }
        let personality;
        if (personalityId) {
            personality = await assistOS.space.getPersonality(personalityId);
        } else {
            personality = await assistOS.space.getPersonality(constants.PERSONALITIES.DEFAULT_PERSONALITY_ID);
        }
        const executeFlow = async (context, personality) => {
            flowInstance.__securityContext = {};
            return await flowInstance.execute(context, personality);
        };
        return await executeFlow(context, personality);
    }
}

module.exports = {
    getFlow,
    listFlows,
    addFlow,
    updateFlow,
    deleteFlow,
    callFlow,
    callServerFlow,
    sendRequest,
    IFlow
}