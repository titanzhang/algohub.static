// var editFormConfig = {
//   baseUrl: '/mgmt/',
//   formId: 'editForm',
//   editorId: 'algoEditor',
//   tagsId: 'algoTags',
//   contentId: 'algoAll',
//   sectionId: 'algoSection',
//   modId: 'algoMod'
// };

ahjs.EditFormModule = {
	configName: 'editFormConfig'
};

ahjs.EditFormModule.init = function() {
	var config = ahjs.getConfig(this.configName);
	if (config === undefined) {
		return false;
	}

	var baseUrl = config.baseUrl;
	var saveUrl = config.saveUrl;
	var algoName = config.algoName;
	var formObj = $('#' + config.formId);
	var editorObj = this.createEditor("#" + config.editorId);
	var modObj = $('#' + config.modId);

	editorObj.value(modObj.val());
	ahjs.on('AlgoEdit.error', this.showError());
	ahjs.on('AlgoEdit.submit', this.onStep(formObj, editorObj, modObj, algoName, baseUrl));
	ahjs.on('AlgoEdit.save', this.saveResult(saveUrl, formObj, modObj, editorObj));
	ahjs.on('AlgoEdit.saveResponse', this.saveResponse());
	$("[ahlink='edit']").click(this.onClickSubmit());
	$('#' + config.finishId).click(this.onClickFinish());
};

ahjs.EditFormModule.saveResult = function(saveUrl, formObj, modObj, editorObj) {
	var callback = function() {
		modObj.val(editorObj.value());
		$.post(saveUrl, formObj.serialize(), function(data) {
			ahjs.trigger('AlgoEdit.saveResponse', data);
		});
	};
	return callback;
};

ahjs.EditFormModule.saveResponse = function() {
	var callback = function(data) {
		console.log(data);
	};
	return callback;
};

ahjs.EditFormModule.createEditor = function(id) {
	var self = this;
	return new SimpleMDE({
		element: $(id)[0],
		toolbar: [
			'bold', 'italic', 'heading', '|',
			'code', 'quote', 'unordered-list', 'ordered-list', '|',
			'link', 'image', 'table',
			{
				name: 'ytVideo',
				action: this.ytVideo,
				className: 'fa fa-youtube-play',
				title: 'Youtube Video'
			}, '|',
			'preview', '|', 'guide'
		],
		previewRender: function(plainText, preview) {
			var defaultRender = this.parent.markdown.bind(this.parent);
			setTimeout(function() {
				try {
					preview.innerHTML = defaultRender(self.ytVideoRender(plainText))
				} catch(e) {
					preview.innerHTML = 'Failed';
				}
			}, 250);
			return 'Loading ...';
		}
	});
};

ahjs.EditFormModule.ytVideoRender = function(plainText) {
	var syntax = /(?:(?:https?:\/\/)?(?:www.youtube.com\/(?:embed\/|watch\?v=)|youtu.be\/)?([^?& ]+)(?:\?rel=\d)?)(?:\s+(\d+)\s(\d+))?/i;
	var startTag = '{% youtube', endTag = '%}';

	var startIndex = plainText.indexOf(startTag);
	while (startIndex >= 0) {
		var prePart = plainText.substring(0, startIndex);
		var postPart = plainText.substr(startIndex + startTag.length);

		var endIndex = postPart.indexOf(endTag);
		if (endIndex < 0) break;

		var midPart = postPart.substring(0, endIndex).trim();
		var found = midPart.match(syntax);
		if (found && found.length > 1) {
			var id = found[1], width = found[2], height = found[3];
			if (width === undefined) width = 480;
			if (height === undefined) height = 320;
			var html = '<iframe width="'+width+'" height="'+height+'" frameborder="0" src="http://www.youtube.com/embed/'+id+'?ecver=2"></iframe>';
			plainText = prePart + html + postPart.substr(endIndex + endTag.length);
		} else {
			plainText = prePart + postPart.substr(endIndex + endTag.length);
		}

		startIndex = plainText.indexOf(startTag);
	}

	return plainText;
};

ahjs.EditFormModule.ytVideo = function(editor) {
	var cm = editor.codemirror;
	var selectedText = cm.getSelection();
	var text = selectedText || 'youtube link';
	cm.replaceSelection('{% youtube ' + text + ' %}');
};

ahjs.EditFormModule.showError = function() {
	var callback = function(error) {
		alert(error);
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

ahjs.EditFormModule.onStep = function(formObj, editorObj, modObj, algoName, baseUrl) {
	var callback = function(step) {
		// Save the modified content
		modObj.val(editorObj.value());

		// Construct the url and submit the form
		var action = baseUrl + encodeURIComponent(algoName) + '/' + step;
		formObj.attr('action', action);
		formObj.submit();
	};
	return callback;
};

ahjs.EditFormModule.init();

