// var searchConfig = {
//   formID: "navbar_search",
//   tagID: "navbar_search.tag",
//   tagListID: "navbar_search.tagList",
//   titleID: "avbar_search.title",
//   resultID: "navbar_search.result",
//   contentID: "navbar_search.result.content",
//   linkTemplate: "<p><a href='{URL}'>{TITLE}</a></p>",
//   tagTemplate: "<li><a href='javascript:void()' ahlink='search_tag' ahdata='{DATA}'>{TITLE}</a></li>",
//   tagUrl: "/tags.html",
//	 searchUrl: "{{site.searchbase}}",
// 	 baseUrl: "{{site.baseUrl}}"
// };
// ahjs.addConfig('navbarSearchConfig', searchConfig);

ahjs.NavSearchModule = {
	configName: 'navbarSearchConfig'
};

ahjs.NavSearchModule.init = function() {
	var config = ahjs.getConfig(this.configName);
	if (config === undefined) {
		return false;
	}

	var formObj = $('#' + config.formID);
	var tagObj = $('#' + config.tagID);
	var tagListObj = $('#' + config.tagListID);
	var titleObj = $('#' + config.titleID);
	var resultObj = $('#' + config.resultID);
	var contentObj = $('#' + config.contentID);
	var linkTemplate = config.linkTemplate;
	var tagTemplate = config.tagTemplate;
	var tagUrl = config.tagUrl;
	var searchUrl = config.searchUrl;
	var baseUrl = config.baseUrl;

	ahjs.on('NavSearch.renderTagList', this.onRenderTagList(tagListObj, tagTemplate, tagObj));
	ahjs.on('NavSearch.search', this.onSearch(searchUrl, linkTemplate));
	ahjs.on('NavSearch.showResult', this.onShowResult(resultObj, contentObj));
	ahjs.on('NavSearch.hideResult', this.onHideResult(resultObj));
	formObj.submit(this.onFormSubmit(tagObj, titleObj));

	this.buildTagList(tagUrl);
};

ahjs.NavSearchModule.onRenderTagList = function(tagListObj, tagTemplate, tagObj) {
	var self = this;
	var callback = function(tagList) {
		if (!tagList) return;
		var html = tagListObj.html();
		for (var i in tagList) {
			html += tagTemplate.replace('{DATA}', tagList[i]).replace('{TITLE}', tagList[i]);
		}
		tagListObj.html(html);
		$("[ahlink='search_tag']").click(self.onClickTag(tagObj));
	};
	return callback;
};

ahjs.NavSearchModule.buildTagList = function(tagUrl) {
	try {
		$.get(tagUrl, this.onGetTagsReturn());
	} catch(e) {}
};

ahjs.NavSearchModule.onGetTagsReturn = function() {
	var callback = function(data, status) {
		if (status === 'success') {
			ahjs.trigger('NavSearch.renderTagList', JSON.parse(data));
		}
	};
	return callback;
};

ahjs.NavSearchModule.onClickTag = function(tagObj) {
	var callback = function(event) {
		var tag = $(this).attr('ahdata');
		if (!tag) {
			tagObj.attr('ahdata', '');
			tagObj.html('Tag');
		} else {
			tagObj.attr('ahdata', tag);
			tagObj.html(tag);
		}
	};
	return callback;
};

ahjs.NavSearchModule.onFormSubmit = function(tagObj, titleObj) {
	var callback = function() {
		ahjs.trigger('NavSearch.search', tagObj.attr('ahdata'), titleObj.val());
		return false;
	};
	return callback;
};

ahjs.NavSearchModule.onSearch = function(searchUrl, linkTemplate) {
	var self = this;
	var callback = function(tag, title) {
		ahjs.trigger('NavSearch.showResult', 'Searching ...');
		var url = searchUrl + '?q=' + encodeURIComponent(title || '') + '&tag=' + encodeURIComponent(tag || '');
		$.get(url, self.onSearchReturn(searchUrl, linkTemplate)).fail(function() {
			ahjs.trigger('NavSearch.showResult', 'Failed!');
			ahjs.trigger('NavSearch.hideResult', 5000);			
		});	
	};
	return callback;
};

ahjs.NavSearchModule.onSearchReturn = function(searchUrl, linkTemplate) {
	var callback = function(data, status) {
		if (status === 'success' && data.status) {
			var html = '';
			for (var i in data.result.pages) {
				var page = data.result.pages[i];
				html += linkTemplate.replace('{URL}', page.url).replace('{TITLE}', page.title);
			}
			ahjs.trigger('NavSearch.showResult', html || 'No algorithm found!');
		} else {
			ahjs.trigger('NavSearch.showResult', 'Failed!');
			ahjs.trigger('NavSearch.hideResult', 5000);
		}
	};
	return callback;
};

ahjs.NavSearchModule.onShowResult = function(resultObj, contentObj) {
	var callback = function(html) {
		contentObj.html(html);
		resultObj.modal('show');
	};
	return callback;
};

ahjs.NavSearchModule.onHideResult = function(resultObj) {
	var callback = function(delay) {
		if (delay !== undefined && delay > 0) {
			setTimeout(function(){resultObj.modal('hide');}, delay);
		} else {
			resultObj.modal('hide');
		}
	};
	return callback;
};

ahjs.NavSearchModule.init();