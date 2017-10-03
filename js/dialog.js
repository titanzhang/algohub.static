// var dialogConfig = {
//   dialogID: "ahDialog",
//   titleID: "dialogTitle",
//   contentID: "dialogContent"
// };

ahjs.DialogModule = {
	configName: 'dialogConfig'
};

ahjs.DialogModule.init = function() {
	var config = ahjs.getConfig(this.configName);
	if (config === undefined) {
		return false;
	}

	var dialogObj = $('#' + config.dialogID);
	var titleObj = $('#' + config.titleID);
	var contentObj = $('#' + config.contentID);

	ahjs.on('Dialog.show', this.onShowHide(dialogObj, true));
	ahjs.on('Dialog.hide', this.onShowHide(dialogObj, false));
	ahjs.on('Dialog.setTitle', this.onSetTitle(titleObj));
	ahjs.on('Dialog.setContent', this.onSetContent(contentObj));
};

ahjs.DialogModule.onShowHide = function(dialogObj, isShow) {
	var callback = function() {
		dialogObj.modal({backdrop: 'static', keyboard: false, show: isShow? 'show': 'hide'});
	};
	return callback;
};

ahjs.DialogModule.onSetTitle = function(titleObj) {
	var callback = function(title) {
		titleObj.html(title);
	};
	return callback;
};

ahjs.DialogModule.onSetContent = function(contentObj) {
	var callback = function(content) {
		contentObj.html(content);
	};
	return callback;
};

ahjs.DialogModule.init();