async function sendRequest(url, method, data){
    let result;
    let init = {
        method: method
    };
    if(method === "POST" || method === "PUT"){
        init.body = typeof data === "string" ? data : JSON.stringify(data);
        init.headers = {
            "Content-type": "application/json; charset=UTF-8"
        };
    }
    try {
        result = await fetch(url,init);
    } catch (err) {
        console.error(err);
    }
    return await result.text();
}
const flowType = "flows";
async function getFlowsMetadata(spaceId){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${flowType}`, "GET");
}
async function getFlow(spaceId, flowId){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${flowType}/${flowId}`, "GET")
}
async function addFlow(spaceId, flowData){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${flowType}`, "POST", flowData)
}
async function updateFlow(spaceId, flowId, flowData){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${flowType}/${flowId}`, "PUT", flowData)
}
async function deleteFlow(spaceId, flowId){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${flowType}/${flowId}`, "DELETE")
}