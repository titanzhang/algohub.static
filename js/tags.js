// var tagsConfig = {
//   containerID: "ahTags",
//   templateID: "ahTagsTemplate",
//   list: ['test tag1', 'test tag2', 'test tag3'],
// };
// ahjs.addConfig('tagsConfig', tagsConfig);

ahjs.TagsModule = {
	configName: 'tagsConfig'
};

ahjs.TagsModule.init = function() {
	var config = ahjs.getConfig(this.configName);
	if (config === undefined) {
		return false;
	}

	var container = $('#' + config.containerID);
	var template = $('#' + config.templateID).html();
	this.tagList = config.list.trim().length === 0? []: config.list.split(',');

	ahjs.on('Tags.build', this.onBuildTags(container, template));
	ahjs.on('Tags.add', this.onAddTag());
	$("[ahlink='addtag']").click(this.onClickAddTag());

	ahjs.trigger('Tags.build');
};

ahjs.TagsModule.onClickAddTag = function() {
	var callback = function(event) {
		var tag = event.currentTarget.attributes['ahdata'].value;
		ahjs.trigger('Tags.add', tag);
	};
	return callback;
};

ahjs.TagsModule.bindTagLinks = function() {
	$("[ahlink='tag']").click(this.onRemoveTag());
};

ahjs.TagsModule.unbindTagLinks = function() {
	$("[ahlink='tag']").off('click');
};

ahjs.TagsModule.onAddTag = function() {
	var self = this;
	var callback = function(newTag) {
		for (let i in self.tagList) {
			if (self.tagList[i] === newTag) return;
		}
		self.tagList.push(newTag);
		ahjs.trigger('Tags.build');
	};
	return callback;
};

ahjs.TagsModule.onRemoveTag = function() {
	var self = this;
	var callback = function(event) {
		var tag = event.currentTarget.attributes['ahdata'].value;
		for (var i in self.tagList) {
			if (self.tagList[i] === tag) {
				self.tagList.splice(i, 1);
				break;
			}
		}
		ahjs.trigger('Tags.build');
		return false;
	};
	return callback;
};

ahjs.TagsModule.onBuildTags = function(container, template) {
	var self = this;
	var callback = function() {
		var html = '';
		for (let i in self.tagList) {
			var tag = self.tagList[i];
			html += template.replace(/\{AHTAG\}/g, tag);
		}
		container.html(html);
		self.unbindTagLinks();
		self.bindTagLinks();
		ahjs.trigger('Tags.changed', self.tagList);
	};
	return callback;
};

ahjs.TagsModule.init();