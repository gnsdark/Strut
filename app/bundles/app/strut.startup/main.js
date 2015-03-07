define(['strut/editor/EditorView',
        'strut/editor/EditorModel',
        'strut/cloud/main'],
function(EditorView, EditorModel,cloud) {
	var registry = null;
	var editorStartup = {
		run: function() {
			var model = new EditorModel(registry);
    		var editor = new EditorView({model: model, registry: registry});
    		editor.render();
    		$('body').append(editor.$el);

    		if (sessionMeta.lastPresentation != null) {
    			// Load it up.
    			var storageInterface = registry.getBest('strut.StorageInterface');
    			storageInterface.load(sessionMeta.lastPresentation, function(pres, err) {
    				if (!err) {
    					model.importPresentation(pres);
    				} else {
    					console.log(err);
    					console.log(err.stack);
    				}
    			});
    		}
		}
	};

	var welcome = {
		run: function() {
			// If no previous presentation was detected, show the welcome screen.
			var loca = window.location;
			if(loca.hash && loca.hash.indexOf("#session") > -1){
				var params = loca.hash.split('/');
				params.shift();
				cloud.load(loca,params);
			}
		}
	};

	return {
		initialize: function(reg) {
			registry = reg;
			registry.register({
				interfaces: 'strut.StartupTask'
			}, editorStartup);

			registry.register({
				interfaces: 'strut.StartupTask'
			}, welcome);
		}
	};
});