const sendRequest = require("assistos").loadModule("util").sendRequest;
async function sendLLMRequest(data){
    return await sendRequest(`/llms/generate`, "PUT", data)
}
const LLM = require("./models/LLM.js");
module.exports = {
    sendLLMRequest,
    LLM
}