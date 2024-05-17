const IFlow = require("./models/IFlow.js");
const sendRequest = require("assistos").loadModule("util").sendRequest;
const constants = require("../../constants.js");
async function loadFlows(spaceId) {
    return await import(`/spaces/flows/${spaceId}`);
}

async function getFlow(spaceId, flowName) {
    return await import(`/spaces/flows/${spaceId}/${flowName}`);
}

async function addFlow(spaceId, flowName, flowData) {
    return await sendRequest(`/spaces/flows/${spaceId}/${flowName}`, "POST", flowData)
}

async function updateFlow(spaceId, flowName, flowData) {
    return await sendRequest(`/spaces/flows/${spaceId}/${flowName}`, "PUT", flowData)
}

async function deleteFlow(spaceId, flowName) {
    return await sendRequest(`/spaces/flows/${spaceId}/${flowName}`, "DELETE")
}
async function callServerFlow(spaceId, flowName, context, personalityId) {
    return await sendRequest(`/spaces/callFlow/${spaceId}/${flowName}`, "POST", {
        context:context,
        personalityId:personalityId
    });
}
async function callFlow(spaceId, flowName, context, personalityId) {
    const envType = require("assistos").envType;
    if (envType === 'node') {
        return await callServerFlow(spaceId, flowName, context, personalityId);
    } else if (envType === 'browser') {
        let flowClass;
        if (assistOS.currentApplicationName === assistOS.configuration.defaultApplicationName) {
            flowClass = await assistOS.space.getFlow(flowName);
        } else {
            let app = assistOS.space.getApplicationByName(assistOS.currentApplicationName);
            flowClass = app.getFlow(flowName);
        }
        let personality;
        if (personalityId) {
            personality = assistOS.space.getPersonality(personalityId);
        } else {
            personality = assistOS.space.getPersonality(constants.PERSONALITIES.DEFAULT_PERSONALITY_ID);
        }
        if (flowClass.inputSchema) {
            // assistOS.services.validateSchema(context, flow.inputSchema, "input");
        }
        let flowInstance = new flowClass();
        if (flowInstance.start === undefined) {
            throw new Error(`Flow ${flowInstance.constructor.name} must have a function named 'start'`);
        }
        const apis = Object.getOwnPropertyNames(IFlow.prototype)
            .filter(method => method !== 'constructor');
        apis.forEach(methodName => {
            flowInstance[methodName] = IFlow.prototype[methodName].bind(flowInstance);
        });
        if (flowClass.inputSchema) {
            // assistOS.services.validateSchema(context, flow.inputSchema, "input");
        }

        let response;
        try {
            response = await ((context, personality) => {
                let returnPromise = new Promise((resolve, reject) => {
                    flowInstance.resolve = resolve;
                    flowInstance.reject = reject;
                });
                flowInstance.personality = personality;
                flowInstance.start(context, personality);
                return returnPromise;
            })(context, personality);
        } catch (e) {
            console.error(e);
            return await showApplicationError("Flow execution Error", `Error executing flow ${flowObj.flowInstance.constructor.name}`, e);
        }
        if (flowClass.outputSchema) {
            if (typeof flowClass.outputSchema.isValid === "undefined") {
                try {
                    let parsedResponse = JSON.parse(response);
                    //assistOS.services.validateSchema(parsedResponse, flowObj.flowClass.outputSchema, "output");
                    return parsedResponse;
                } catch (e) {
                    console.error(e);
                    return await showApplicationError(e, e, e.stack);
                }
            }
        }
        return response;
    }
}

module.exports = {
    getFlow,
    loadFlows,
    addFlow,
    updateFlow,
    deleteFlow,
    callFlow,
    callServerFlow,
    IFlow
}