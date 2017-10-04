// var editFormConfig = {
//   formId: 'editForm',
//   nameId: 'algoName',
//   tagsId: 'algoTags'
// };

ahjs.EditFormModule = {
	configName: 'editFormConfig'
};

ahjs.EditFormModule.init = function() {
	var config = ahjs.getConfig(this.configName);
	if (config === undefined) {
		return false;
	}

	var formObj = $('#' + config.formId);
	var nameObj = $('#' + config.nameId);
	var tagsObj = $('#' + config.tagsId);
	var baseUrl = config.baseUrl;
	var saveUrl = config.saveUrl;

	ahjs.on('AlgoEdit.error', this.showError());
	ahjs.on('AlgoEdit.submit', this.onStep(formObj, nameObj, tagsObj, baseUrl));
	ahjs.on('AlgoEdit.save', this.saveResult(saveUrl, formObj, nameObj));
	ahjs.on('AlgoEdit.saveResponse', this.saveResponse());
	$("[ahlink='edit']").click(this.onClickSubmit());
	$('#' + config.finishId).click(this.onClickFinish());
};

ahjs.EditFormModule.showError = function() {
	var callback = function(error) {
		alert(error);
	};
	return callback;
};

ahjs.EditFormModule.saveResult = function(saveUrl, formObj, nameObj) {
	var callback = function() {
		if (nameObj !== null) {
			if (nameObj.val().trim().length === 0) {
				ahjs.trigger('AlgoEdit.error', 'Algorightm name cannot be empty!');
				return;
			}
			ahjs.trigger('Dialog.setTitle', 'Save Algorithm');
			ahjs.trigger('Dialog.setContent', 'Processing ...');
			ahjs.trigger('Dialog.show');
		}

		$.post(saveUrl, formObj.serialize(), function(data) {
			ahjs.trigger('AlgoEdit.saveResponse', data);
		});
	};
	return callback;
};

ahjs.EditFormModule.saveResponse = function() {
	var callback = function(data) {
		if (data.status) {
			// Success
			var content = '<h4>Algorithm saved!</h4>See your algorithm <a href="' + data.result.link + '">here</a>';
			ahjs.trigger('Dialog.setContent', content);
		} else {
			ahjs.trigger('Dialog.setContent', 'Whoops! Something is going wrong');
			console.log(data.message || 'save failed');
		}
		ahjs.trigger('Dialog.show');
	};
	return callback;
};

ahjs.EditFormModule.onClickSubmit = function() {
	var callback = function(event) {
		ahjs.trigger('AlgoEdit.submit', event.currentTarget.attributes['ahaction'].value);
		return false;
	};
	return callback;
};

ahjs.EditFormModule.onClickFinish = function() {
	var callback = function(event) {
		ahjs.trigger('AlgoEdit.save');
		return false;
	};
	return callback;
};

ahjs.EditFormModule.onStep = function(formObj, nameObj, tagsObj, baseUrl) {
	var callback = function(step) {
		// Validate input values
		if (nameObj !== null) {
			if (nameObj.val().trim().length === 0) {
				ahjs.trigger('AlgoEdit.error', 'Algorightm name cannot be empty!');
				return;
			}
		}
		if (tagsObj.val().trim().length === 0) {
			ahjs.trigger('AlgoEdit.error', 'Tags cannot be empty!');
			return;
		}
		// Construct the url and submit the form
		var action = baseUrl + encodeURIComponent(nameObj.val()) + '/' + step;
		formObj.attr('action', action);
		formObj.submit();
	};
	return callback;
};

ahjs.EditFormModule.init();

