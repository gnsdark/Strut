define(['libs/backbone', 'lang'],
	function(Backbone, lang,Imgup) {
		var modalCache = null;
		var Modal = Backbone.View.extend({
			className: "itemGrabber modal hide",
			events: {
				"click .ok": "okClicked",
				"hidden": "hidden"
			},
			initialize: function() {
				this._template = JST['strut.cloud/ErrorDialog'];
			},
			show: function(title,info) {
				this.title.html(title||"");
				this.error.html(info||"");
				return this.$el.modal('show');
			},
			okClicked: function() {
				if (!this.$el.find(".ok").hasClass("disabled")) {
					return this.$el.modal('hide');
				}
			},
			hidden: function() {
				
			},
			render: function() {
				var _this = this;
				var opt={
					submit:lang["submit"]||"Ok"
				};
				this.$el.html(this._template(opt));
				this.$el.modal();
				this.$el.modal("hide");
				this.title = this.$el.find("[name=Title]");
				this.error = this.$el.find(".alert");
				return this.$el;
			},
			constructor: function ItemImportModal() {
				Backbone.View.prototype.constructor.apply(this, arguments);
			}
		});

		return {
			open: function(title,info) {
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
				modalCache.show(title,info);
			}
		};
	});