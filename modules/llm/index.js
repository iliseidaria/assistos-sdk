const {getAPIClient} = require("../util/utils");
const constants = require("../../constants");

const getModels = async function ({spaceId}) {
    let client = await getAPIClient("*", constants.LLM_PLUGIN, spaceId);
    return await client.getModels()
}
const getProviderModels = async function ({spaceId, provider}) {
    let client = await getAPIClient("*", constants.LLM_PLUGIN, spaceId);
    return await client.getProviderModels({provider})
}

const getTextResponse = async function ({spaceId,provider, apiKey, model, prompt, options = {}}) {
    let client = await getAPIClient("*", constants.LLM_PLUGIN, spaceId);
    return await client.getTextResponse({
        provider,
        apiKey,
        model,
        prompt,
        options
    })
}
const getTextStreamingResponse = async function ({spaceId,provider, apiKey, model, prompt, options = {}, onDataChunk}) {
    let client = await getAPIClient("*", constants.LLM_PLUGIN, spaceId);
    return await client.getTextStreamingResponse({
        provider,
        apiKey,
        model,
        prompt,
        options,
        onDataChunk
    })
}
const getChatCompletionResponse = async function ({spaceId,provider, apiKey, model, messages, options = {}}) {
    let client = await getAPIClient("*", constants.LLM_PLUGIN, spaceId);
    return await client.getChatCompletionResponse({
        provider,
        apiKey,
        model,
        messages,
        options
    })
}
const getChatCompletionStreamingResponse = async ({spaceId,provider, apiKey, model, messages, options = {}, onDataChunk}) => {
    let client = await getAPIClient("*", constants.LLM_PLUGIN, spaceId);
    return await client.getChatCompletionStreamingResponse({
        provider,
        apiKey,
        model,
        messages,
        options,
        onDataChunk
    });
}
module.exports = {
    getModels,
    getProviderModels,
    getTextResponse,
    getTextStreamingResponse,
    getChatCompletionResponse,
    getChatCompletionStreamingResponse
}