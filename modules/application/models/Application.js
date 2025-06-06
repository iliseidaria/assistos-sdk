class Application {
    constructor(applicationData) {
        this.name = applicationData.name;
        this.description = applicationData.description;
        this.installationDate = applicationData.installationDate;
        this.lastUpdate = applicationData.lastUpdate;
        this.flowsBranch = applicationData.flowsBranch;
        this.flows = [];
    }

    async loadFlows(spaceId){
        const {loadAppFlows} = require("assistos").loadModule("application");
        let flows = await loadAppFlows(spaceId, this.name);
        for (let [name, flowClass] of Object.entries(flows)) {
            this.flows.push(flowClass);
        }
    }
    stringifyApplication(){
        return {
            name: this.name,
            description: this.description,
            installationDate: this.installationDate,
            lastUpdate: this.lastUpdate,
            flowsBranch: this.flowsBranch
        };
    }

    getFlow(flowName){
        let flow = this.flows.find(flow => flow.name === flowName);
        return flow || console.error(`Flow not found in application ${this.name}, flow name: ${flowName}`);
    }
}
module.exports = Application;
