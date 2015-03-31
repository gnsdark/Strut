require.config({
	paths: {
		libs: "../scripts/libs",
		preview_export: "../preview_export",

		jquery: "../scripts/libs/jQuery",
		jqueryui: "../scripts/libs/jquery-ui",
		touchpunch: "../scripts/libs/jquery-ui-touch-punch",
		"jquery.multisortable": "../scripts/libs/jquery.multisortable",
		position: "../components/jq-contextmenu/jquery.ui.position",
		jqContextMenu: "../components/jq-contextmenu/jquery.contextMenu",
		lodash: "../scripts/libs/lodash",
		backbone: "../scripts/libs/backbone",
		css: "../scripts/libs/css",
		bootstrap: "../components/bootstrap/bootstrap",
		colorpicker: "../components/spectrum/spectrum",
		handlebars: '../scripts/libs/Handlebars',
		lang: "../locales/lang",
		lexed: '../components/lexed/lexed',
		codemirror: '../components/codemirror',
		'marked': '../components/marked/marked',

		// build - rmap
		'strut/deck': '../bundles/app/strut.deck',
		'strut/startup': '../bundles/app/strut.startup',
		'strut/cloud': '../bundles/app/strut.cloud',
		'strut/editor': '../bundles/app/strut.editor',
		'strut/etch_extension': '../bundles/app/strut.etch_extension',
		'strut/exporter/zip/browser': '../bundles/app/strut.exporter.zip.browser',
		'strut/exporter': '../bundles/app/strut.exporter',
		'strut/exporter/json': '../bundles/app/strut.exporter.json',
		'strut/header': '../bundles/app/strut.header',
		'strut/importer': '../bundles/app/strut.importer',
		'strut/importer/json': '../bundles/app/strut.importer.json',
		'strut/presentation_generator/impress': '../bundles/app/strut.presentation_generator.impress',
		'strut/logo_button': '../bundles/app/strut.logo_button',
		'strut/document': '../bundles/app/strut.document',
		'strut/presentation_generator': '../bundles/app/strut.presentation_generator',
		'strut/slide_components': '../bundles/app/strut.slide_components',
		'strut/slide_editor': '../bundles/app/strut.slide_editor',
		'strut/slide_snapshot': '../bundles/app/strut.slide_snapshot',
		'strut/storage': '../bundles/app/strut.storage',
		'strut/themes': '../bundles/app/strut.themes',
		'strut/well_context_buttons': '../bundles/app/strut.well_context_buttons',
		'strut/config': '../bundles/app/strut.config',
		'strut/transition_editor': '../bundles/app/strut.transition_editor',

		'tantaman/web': '../bundles/common/tantaman.web',
		'tantaman/web/local_storage': '../bundles/common/tantaman.web.local_storage',
		'tantaman/web/remote_storage': '../bundles/common/tantaman.web.remote_storage',
		'tantaman/web/saver': '../bundles/common/tantaman.web.saver',
		'tantaman/web/storage': '../bundles/common/tantaman.web.storage',
		'tantaman/web/undo_support': '../bundles/common/tantaman.web.undo_support',
		'tantaman/web/interactions': '../bundles/common/tantaman.web.interactions',
		'tantaman/web/widgets': '../bundles/common/tantaman.web.widgets',
		'tantaman/web/css_manip': '../bundles/common/tantaman.web.css_manip'
			// end build - rmap
	},

	shim: {
		bootstrap: {
			deps: ["jquery"]
		},

		"jquery.multisortable": {
			deps: ["jquery", "jqueryui"]
		},

		touchpunch: {
			deps: ["jquery", "jqueryui"]
		},

		jqueryui: {
			deps: ["jquery"]
		},

		colorpicker: {
			deps: ["jquery"]
		},

		gradientPicker: {
			deps: ["jquery", "colorpicker"]
		},

		position: {
			deps: ["jquery"]
		},

		jqContextMenu: {
			deps: ["jquery", "position"]
		},

		"codemirror/codemirror": {
			deps: ["css!../components/codemirror/codemirror.css"],
			exports: 'CodeMirror'
		},

		'codemirror/modes/css': {
			deps: ['codemirror/codemirror']
		},

		'codemirror/modes/markdown': {
			deps: ['codemirror/codemirror']
		}
	}
});

function getSelectionBoundaryElement(win, isStart) {
	var range, sel, container = null;
	var doc = win.document;

	if (doc.selection) {
		// IE branch
		range = doc.selection.createRange();
		range.collapse(isStart);
		return range.parentElement();
	} else if (win.getSelection) {
		// Other browsers
		sel = win.getSelection();

		if (sel.rangeCount > 0) {
			range = sel.getRangeAt(0);
			container = range[isStart ? "startContainer" : "endContainer"];

			// Check if the container is a text node and return its parent if so
			if (container.nodeType === 3) {
				container = container.parentNode;
			}
		}
	}
	return container;
}

var __hasProp = {}.hasOwnProperty,
	__extends = function(child, parent) {
		for (var key in parent) {
			if (__hasProp.call(parent, key)) child[key] = parent[key];
		}

		function ctor() {
			this.constructor = child;
		}

		ctor.prototype = parent.prototype;
		child.prototype = new ctor();
		child.__super__ = parent.prototype;
		return child;
	};

window.__extends = __extends;

window.zTracker = {
	z: 0,
	next: function() {
		return ++this.z;
	}
};

// TODO: we'll have to make a more generic one that hooks into
// the storage providers...
window.clearPresentations = function() {
	var len = localStorage.length;
	for (var i = 0; i < len; ++i) {
		var key = localStorage.key(i);
		if (key && key.indexOf(".strut") != -1) {
			console.log('Removing: ' + key);
			localStorage.removeItem(key);
		}
	}
};

window.log = function(msg) {
	if (log.enabled.log)
		console.log(msg);
};

log.enabled = {
	notice: true,
	err: true,
	log: true
};

log.err = function(msg) {
	if (log.enabeld.err)
		console.error(msg);
};

log.notice = function(msg) {
	if (log.enabled.notice)
		console.log(msg);
}

// reassigning rquire to r for
// the "preview" includes so they don't get built into the actual
// amd app.
// TODO: move this stuff into index.html
// so we don't have to include the actual amd-app when
// we go to present.
require([
		'handlebars',
		'lang',
		'compiled-templates',
		'colorpicker',
		'strut/config/config',
		'features',
		'./StrutLoader',
		'bootstrap',
		'jqContextMenu',
		'css!components/jq-contextmenu/jquery.contextMenu.css',
		'touchpunch',
		'preview_export/scripts/dataset-shim'
	],
	function(Handlebars, lang, empt, empty, config, registry, StrutLoader, bootstrap, ContextMenu, css, tp, dss) {
		'use strict';
		var agent = window.navigator.userAgent;
		if (agent.indexOf('WebKit') >= 0)
			window.browserPrefix = "-webkit-"
		else if (agent.indexOf('MSIE') >= 0)
			window.browserPrefix = "-ms-"
		else if (agent.indexOf('Mozilla') >= 0)
			window.browserPrefix = "-moz-"
		else
			window.browserPrefix = ""

		Handlebars.registerHelper("either", function(a, b) {
			return b != null ? b : a;
		});

		$.event.special.destroyed = {
			remove: function(o) {
				if (o.handler)
					o.handler();
			}
		};

		var isMouseDown = false;
		var minElement,maxElement,moveElement,maxWidth;
		// callback holders
		var dragCallbacks = {};
		// global position records
		var lastMouseX;
		var lastMouseY;
		// returns the mouse (cursor) current position
		$.getMousePosition = function(e) {
				var posx = 0;
				var posy = 0;
				if (!e) var e = window.event;
				if (e.pageX || e.pageY) {
					posx = e.pageX;
					posy = e.pageY;
				} else if (e.clientX || e.clientY) {
					posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
					posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
				}
				return {
					'x': posx,
					'y': posy
				};
			}
		$.updatePosition = function(e) {
				var pos = $.getMousePosition(e);
				var spanX = (pos.x - lastMouseX);
				var spanY = (pos.y - lastMouseY);
				return {
					"x":spanX,
					"y":spanY
				};
			}
		$(document).mousemove(function(e) {
			if (isMouseDown) {
				if (dragCallbacks[moveElement[0].id] != undefined) {
					dragCallbacks[moveElement[0].id](moveElement,minElement,maxElement,maxWidth,movetype,$.updatePosition(e));
				}
				return false;
			}
		});
		$(document).mouseup(function(e) {
			if (isMouseDown) {
				isMouseDown = false;
				return false;
			}
		});
		var _ids = 1;
		var ids = function(){
			return _ids++;
		}
		var movetype = 0;//-1 left 1 right 0 move
		$.fn.easymove = function(callback) {
			return this.each(function() {
				// if no id is defined assign a unique one
				if (!this.id) this.id = 'easydrag' + ids();
				dragCallbacks[this.id] = callback;
				$(this).mousedown(function(e) {
					var target = $(e.target);
					var mo = target.attr("data-target");
					if(mo == "lm"){
						movetype = -1;
					}
					else if(mo == "rm"){
						movetype = 1;
					}
					else{
						movetype = 0;
					}
					isMouseDown = true;
					moveElement = $(this);
					minElement = moveElement.prev();
					minElement.data("start",{
						width:minElement.width(),
						height:minElement.height()
					});

					maxElement = moveElement.next();
					maxElement.data("start",{
						width:maxElement.width(),
						height:maxElement.height()
					});
					moveElement.data("start",{
						width:moveElement.width(),
						height:moveElement.height(),
						data:JSON.parse(moveElement.attr("data-split")),
						unit:moveElement.attr("data-unit")
					});
					maxWidth = moveElement.parent().width();
					var pos = $.getMousePosition(e);
					lastMouseX = pos.x;
					lastMouseY = pos.y;
					$.updatePosition(e);
				});
			});
		}
		StrutLoader.start(registry, function() {}, function() {});

		$(window).unload(function() {
			localStorage.setItem('910_Editor_sessionMeta', JSON.stringify(window.sessionMeta));
		});
	});