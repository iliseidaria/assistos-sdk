const constants = require("../../constants.js");
async function request(url, method, securityContext, data){
    let result;
    let init = {
        method: method,
        headers: {}
    };
    if(method === "POST" || method === "PUT" || method === "DELETE"){
        init.body = typeof data === "string" ? data : JSON.stringify(data);
        init.headers = {
            "Content-type": "application/json; charset=UTF-8"
        };
    }
    const assistOS = require("assistos");
    if(assistOS.envType === constants.ENV_TYPE.NODE){
        url = `${constants[constants.ENVIRONMENT_MODE]}${url}`;
        init.headers.Cookie = securityContext.cookies;
    }
    try {
        result = await fetch(url,init);
    } catch (err) {
        console.error(err);
    }
    let response = await result.text()
    let responseJSON = JSON.parse(response);
    if(!responseJSON.success){
        console.error(responseJSON.message);
    }
    return responseJSON.data;
}
const notificationService = (function createNotificationService() {
    const listeners = {};

    function on(event, callback) {
        if (!listeners[event]) {
            listeners[event] = [];
        }
        listeners[event].push(callback);
    }

    function emit(event, data) {
        const eventListeners = listeners[event] || [];
        eventListeners.forEach(callback => callback(data));
    }

    return {
        on,
        emit
    };
})();
module.exports = {
    request,
    notificationService
}