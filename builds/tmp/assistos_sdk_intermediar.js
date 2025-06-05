global.assistos_sdkLoadModules = function(){ 

	if(typeof $$.__runtimeModules["assistos"] === "undefined"){
		$$.__runtimeModules["assistos"] = require("../../index.js");
	}
};
if (true) {
	assistos_sdkLoadModules();
}
global.assistos_sdkRequire = require;
if (typeof $$ !== "undefined") {
	$$.requireBundle("assistos_sdk");
}
