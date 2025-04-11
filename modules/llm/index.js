const {getAPIClient} = require("../util/utils");
const constants = require("../../constants");

const getTextResponse = async ({provider, apiKey, model, prompt, options = {}}) => {
    let client = await getAPIClient("*", constants.LLM_PLUGIN, spaceId);
    return await client.getTextResponse({
        provider,
        apiKey,
        model,
        prompt,
        options
    })
}
const getTextStreamingResponse = async ({provider, apiKey, model, prompt, options = {}, onDataChunk}) => {
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
const getChatCompletionResponse = async ({provider, apiKey, model, messages, options = {}}) => {
    let client = await getAPIClient("*", constants.LLM_PLUGIN, spaceId);
    return await client.getChatCompletionResponse({
        provider,
        apiKey,
        model,
        messages,
        options
    })
}
const getChatCompletionStreamingResponse = async ({provider, apiKey, model, messages, options = {}, onDataChunk}) => {
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
    getTextResponse,
    getTextStreamingResponse,
    getChatCompletionResponse,
    getChatCompletionStreamingResponse
}