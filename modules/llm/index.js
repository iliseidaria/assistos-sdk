const LLM = require("./models/LLM.js");
const {request} = require("../util");
async function sendRequest(url, method, data) {
    return await request(url, method, this.__securityContext, data);
}
async function sendLLMRequest(data){
    return await this.sendRequest(`/llms/generate`, "PUT", data)
}
module.exports = {
    sendLLMRequest,
    LLM,
    sendRequest
}