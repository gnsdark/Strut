define(['libs/backbone', 'lang'],
	function(Backbone, lang,Imgup) {
		var modalCache = null;
		var Modal = Backbone.View.extend({
			className: "itemGrabber modal hide",
			events: {
				"click .ok": "okClicked",
				"click .cancel":"cancelClicked",
				"hidden": "hidden"
			},
			initialize: function() {
				this._template = JST['strut.cloud/LoginDialog'];
			},
			show: function(cb) {
				this.cb = cb || null;
				return this.$el.modal('show');
			},
			okClicked: function() {
				this.cb && this.cb();
				if (!this.$el.find(".ok").hasClass("disabled")) {
					return this.$el.modal('hide');
				}
			},
			cancelClicked:function(){
				return this.$el.modal('hide');
			},
			hidden: function() {
				
			},
			render: function() {
				var _this = this;
				var opt={
					title:lang["login_title"]||"Login",
					info:lang["login_info"]||"Please press key",
					cancel:lang["cancel"]||"Cancel",
					submit:lang["submit"]||"Ok"
				};
				this.$el.html(this._template(opt));
				this.$el.modal();
				this.$el.modal("hide");
				return this.$el;
			},
			constructor: function ItemImportModal() {
				Backbone.View.prototype.constructor.apply(this, arguments);
			}
		});

		return {
			open: function(args) {
				if (!modalCache) {
					modalCache = new Modal({
						document_info:this._editorModel
					});
					modalCache.$el.bind('destroyed', function() {
						modalCache = null;
					});
					modalCache.render();
					$('#modals').append(modalCache.$el);
				}
				modalCache.show(args);
			}
		};
	});