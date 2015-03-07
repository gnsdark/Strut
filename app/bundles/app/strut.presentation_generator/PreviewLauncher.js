define(["strut/cloud/main","strut/cloud/view/ErrorDialog","lang"],function(cloud,ErrorDialog,lang) {
	'use strict';
	var launch = 0;

	function PreviewLauncher(editorModel) {
		this._editorModel = editorModel;
	};

	PreviewLauncher.prototype = {
		launch: function(generator) {
			if (window.previewWind)
				window.previewWind.close();

			this._editorModel.trigger('launch:preview', null);

			var previewStr = generator.generate(this._editorModel.deck());

			localStorage.setItem('preview-string', previewStr);
			localStorage.setItem('preview-config', JSON.stringify({
				surface: this._editorModel.deck().get('surface')
			}));

			window.previewWind = window.open(
				'preview_export/' + generator.id + '.html' + generator.getSlideHash(this._editorModel),
				window.location.href);
			var sourceWind = window;
		},
		publish:function(generator){
			var doc = this._editorModel;
			cloud.getInfo(function(err,info){
				if(err){
					return ErrorDialog.open(lang.error_title||"Error",err);
				}
				cloud.publish(info,doc,generator);
			});
			//console.info('publish',generator.generate(doc));
		}
	};

	return PreviewLauncher;
});