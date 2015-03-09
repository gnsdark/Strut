define(['libs/backbone', 'lang','strut/cloud/main'],
	function(Backbone, lang,upimg) {
		var modalCache = null;
		var reg = /[a-z]+:/;
		var ignoredVals = {
			'http:': true,
			'http://': true,
			'file:': true,
			'/': true,
			'https://': true,
			'https:': true
		};

		var Modal = Backbone.View.extend({
			className: "itemGrabber modal hide",
			events: {
				"click .ok": "okClicked",
				"click div[data-option='browse']": "browseClicked",
				"change input[type='file']": "fileChosen",
				"keyup input[name='image']": "urlChanged",
				"paste input[name='image']": "urlChanged",
				"hidden": "hidden"
			},
			initialize: function() {
				this.loadItem = _.debounce(this.loadItem.bind(this), 200);
				this._template = JST['strut.document/DocumentModel'];
			},
			show: function() {
				var doc = this.options.document_info.deck();
				
				this.$title.val(doc.get("document_title")||"");
				this.$keywords.val(doc.get("document_keywords")||"");
				this.$describe.val(doc.get("document_describe")||"");
				this.$input.val(doc.get("document_image")||"");
				this.loadItem();

				return this.$el.modal('show');
			},
			okClicked: function() {
				var doc = this.options.document_info.deck();

				doc.set("document_title",this.$title.val());
				doc.set("document_keywords",this.$keywords.val());
				doc.set("document_describe", this.$describe.val());
				doc.set("document_image", this.$input.val());
				
				if (!this.$el.find(".ok").hasClass("disabled")) {
					return this.$el.modal('hide');
				}
			},
			fileChosen: function(e) {
				var f, reader,
					_this = this;
				f = e.target.files[0];
				if (!f.type.match('image.*'))
					return;

				this._switchToProgress();
				this.item.src = '';
				upimg.upload_img(f,function(prg){
					_this._updateProgress(ratio);
				},function(err,result){
					if(err){
						_this._updateProgress(0);
						_this._switchToThumbnail();
						_this.$input.val();
					}
					else{
						_this._switchToThumbnail();
						_this.$input.val(result.url);
						_this.urlChanged({
							which: -1
						});
					}
				});
			},
			browseClicked: function() {
				return this.$el.find('input[type="file"]').click();
			},
			hidden: function() {
				if (this.$input != null) {
					this.item.src = '';
					return this.$input.val("");
				}
			},
			urlChanged: function(e) {
				if (e.which === 13) {
					this.src = this.$input.val() ||  "./img/strut-touch.png";;
					return this.okClicked();
				} else {
					this.loadItem();
				}
			},
			loadItem: function() {
				var val = this.$input.val();
				if(!val)return this.item.src = "./img/strut-touch.png";
				if (val in ignoredVals)
					return;

				var r = reg.exec(val);
				if (r == null || r.index != 0) {
					val = 'http://' + val;
				}

				this.item.src = val;
				return this.src = this.item.src;
			},
			_itemLoadError: function() {
				if(!this.$input.val()){
					this.$el.find(".ok").removeClass("disabled");
				}
				else{
					this.$el.find(".ok").addClass("disabled");
					return this.$el.find(".alert").removeClass("dispNone");
				}
			},
			_itemLoaded: function() {
				this.$el.find(".ok").removeClass("disabled");
				return this.$el.find(".alert").addClass("dispNone");
			},
			_updateProgress: function(ratio) {
				this.$progressBar.css('width', ratio + '%');
			},
			_switchToProgress: function() {
				this.$thumbnail.addClass('dispNone');
				this.$progress.removeClass('dispNone');
			},
			_switchToThumbnail: function() {
				this.$progress.addClass('dispNone');
				this.$thumbnail.removeClass('dispNone');
			},
			render: function() {
				var _this = this;
				var opt={
					title:lang["document_header"]||"docment",
					document_title:lang["document_title"]||"Title",
					document_title_holder:lang["document_title_holder"]||"Please input title",
					document_keywords:lang["document_keywords"]||"Keywords",
					document_keywords_holder:lang["document_keywords_holder"]||"Please input keywords",
					document_describe:lang["document_describe"]||"Description",
					document_describe_holder:lang["document_describe_holder"]||"Please input description",
					document_image:lang["document_image"]||"Image",
					submit:lang["submit"]||"Save",
					modal_url_error:lang["modal_url_error"]||"The image URL you entered appears to be incorrect",
					modal_browser:lang["modal_browser"]||"Browse"
				};
				this.$el.html(this._template(opt));
				this.$el.modal();
				this.$el.modal("hide");
				this.item = this.$el.find('.preview')[0];
				
				this.item.onerror = function() {
					return _this._itemLoadError();
				};
				this.item.onload = function() {
					return _this._itemLoaded();
				};

				this.$input = this.$el.find("input[name='image']");
				this.$title = this.$el.find("input[name='title']");
				this.$keywords = this.$el.find("input[name='keywords']");
				this.$describe = this.$el.find("textarea[name='describe']");

				this.$progress = this.$el.find('.progress');
				this.$progressBar = this.$progress.find('.bar');
				this.$thumbnail = this.$el.find('.thumbnail');

				return this.$el;
			},
			constructor: function ItemImportModal() {
				Backbone.View.prototype.constructor.apply(this, arguments);
			}
		});

		return Backbone.View.extend({
			className: 'btn-group iconBtns',
			events: {
				'click .act': 'open'
			},

			initialize: function() {
				this._editorModel = this.options.editorModel;
				delete this.options.editorModel;
				this._template = JST['strut.document/button'];
			},

			open: function() {
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
				modalCache.show();
			},

			_bind: function() {
				var self = this;
				this.$el.find('.btn').each(function(i) {
					var $btn = $(this);
					$btn.click(function(e) {
						self.open();
					});
				});
			},

			render: function() {
				this.$el.html(this._template({
					title: lang.document_btn
				}));
				this._bind();
				return this;
			}
		});
	});