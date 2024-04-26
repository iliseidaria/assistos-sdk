const sendRequest = require("assistos").loadModule("util").sendRequest;
async function sendLLMRequest(data){
    return await sendRequest(`/llms/generate`, "PUT", data)
}
module.exports = {
    sendLLMRequest
}