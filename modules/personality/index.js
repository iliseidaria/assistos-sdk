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
const personalityType = "personalities";
async function getPersonalitiesMetadata(spaceId){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}`, "GET");
}
async function getPersonality(spaceId, personalityId){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}/${personalityId}`, "GET")
}
async function addPersonality(spaceId, personalityData){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}`, "POST", personalityData)
}
async function updatePersonality(spaceId, personalityId, personalityData){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}/${personalityId}`, "PUT", personalityData)
}
async function deletePersonality(spaceId, personalityId){
    return await sendRequest(`/spaces/fileObject/${spaceId}/${personalityType}/${personalityId}`, "DELETE")
}
module.exports = {
    getPersonalitiesMetadata,
    getPersonality,
    addPersonality,
    updatePersonality,
    deletePersonality
}