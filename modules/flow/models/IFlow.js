class IFlow{
    return(value){
        return this.resolve(value);
    }

    fail(error) {
        if (typeof error === "string"){
            error = new Error(error);
        }
        return this.reject(error);
    }
    loadModule(moduleName){
        return require("assistos").loadModule(moduleName, this.__securityContext);
    }
    callFlow(flowName, context){
        return assistOS.callFlow(flowName, context, this.personality);
    }
    callChoreography(choreographyName, context){

    }
}
module.exports = IFlow;