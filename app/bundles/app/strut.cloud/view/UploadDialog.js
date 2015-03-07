define(['libs/backbone', 'lang'],
	function(Backbone, lang,upload) {
		var modalCache = null;
		var Modal = Backbone.View.extend({
			className: "itemGrabber modal hide",
			events: {
				"click .ok": "okClicked",
				"click .cancel":"cancelClicked",
				"hidden": "hidden"
			},
			initialize: function() {
				this._template = JST['strut.cloud/UploadDialog'];
			},
			show: function(pub,doc,func) {
				this.func = func;
				this.$title .html(doc.get("document_title"));
				this.$channel.html(pub.pubtitle);
				var date = new Date(Number(pub.publish_date));
				var dateStr = date.getFullYear() + (lang.year||'-') + (date.getMonth() + 1)  + (lang.month||'-') + date.getDate() + (lang.day||'-');
				this.$date.html(dateStr);

				return this.$el.modal('show');
			},
			okClicked: function() {
				var self = this;
				self._switchToProgress();
				self.func.publish(function(progress){
					self._updateProgress(progress);
				},function(err,upload){
					if(err){
						self._updateProgress(0);
						self._switchToThumbnail();
						self.$error.html(err);
						self.$alert.removeClass('dispNone') ;
					}
					else{
						self.func.success(upload,function(err,result){
							self._switchToThumbnail();
							if(err){
								self.$error.html(err);
								self.$alert.removeClass('dispNone') ;
							}
							else{
								if (!self.$el.find(".ok").hasClass("disabled")) {
									return self.$el.modal('hide');
								}
							}
						});
					}
				});
			},
			cancelClicked:function(){
				return this.$el.modal('hide');
			},
			hidden: function() {
				
			},
			_updateProgress: function(ratio) {
				this.$progressBar.css('width', ratio + '%');
			},
			_switchToProgress: function() {
				this.$progress.removeClass('dispNone');
				this.$buttons .addClass('dispNone');
			},
			_switchToThumbnail: function() {
				this.$progress.addClass('dispNone');
				this.$buttons.removeClass('dispNone');
			},
			render: function() {
				var _this = this;
				var opt={
					title:lang["document_upload"]||"upload document",
					document_title:lang["document_title"]||"Title",
					document_channel:lang["document_channel"]||"Channel",
					document_date:lang["document_date"]||"Date",
					cancel:lang["cancel"]||"Cancel",
					submit:lang["submit"]||"Save",
				};
				this.$el.html(this._template(opt));
				this.$el.modal();
				this.$el.modal("hide");
				this.$progress = this.$el.find('.progress');
				this.$progressBar = this.$progress.find('.bar');

				this.$buttons = this.$el.find('[name=buttons]');
				this.$title = this.$el.find('[name=title]');
				this.$channel = this.$el.find('[name=channel]');
				this.$date = this.$el.find('[name=date]');
				this.$alert = this.$el.find('.alert');
				this.$error = this.$el.find('[name=error]');
				return this.$el;
			},
			constructor: function ItemImportModal() {
				Backbone.View.prototype.constructor.apply(this, arguments);
			}
		});

		return {
			open: function(pub,doc,func) {
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
				modalCache.show(pub,doc,func);
			}
		};
	});