window.ahjs = {
	eventList: {}
};

ahjs.addConfig = function(configName, config) {
	if (ahjs.config === undefined) {
		ahjs.config = {};
	}
	ahjs.config[configName] = config;
}

ahjs.getConfig = function(configName) {
	if (ahjs.config === undefined) {
		return undefined;
	} else {
		return ahjs.config[configName];
	}
}

ahjs.on = function(eventName, callBack) {
	if (this.eventList[eventName] === undefined) {
		this.eventList[eventName] = [];
	}
	this.eventList[eventName].push(callBack);
}

ahjs.trigger = function(eventName, params) {
	if (this.eventList[eventName] === undefined) {
		return;
	}
	var i;
	for (i in this.eventList[eventName]) {
		var callBack = this.eventList[eventName][i];
		setTimeout(callBack, 0, params);
	}
}