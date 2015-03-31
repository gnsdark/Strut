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
				"click div[name='age']":"select_age",
				"click div[name='tag']":"select_type",
				"click div[data-option='browse']": "browseClicked",
				"change input[type='file']": "fileChosen",
				"keyup input[name='image']": "urlChanged",
				"paste input[name='image']": "urlChanged",
				"hidden": "hidden"
			},
			initialize: function() {
				this.loadItem = _.debounce(this.loadItem.bind(this), 200);
				this._template = JST['strut.document/DocumentModel'];
				this._templateType = JST['strut.document/TypeSelect'];
				this.$el.css("width","960px").css("margin-left","-480px");
			},
			select_age:function(){
				this.$select_age.css("display","block");
				this._status = "select_age";
			},
			select_type:function(){
				var result = this.$tag.data("value");
				upimg.getDocumentType(function(err,types){
					if(err){
						return;
					}
					var it;
					for (var i = types.length - 1; i >= 0; i--) {
						if(result.hasOwnProperty(types[i].code)){
							types[i].checked = true;
						}
						it = types[i].childs;
						for (var j = it.length - 1; j >= 0; j--) {
							if(result.hasOwnProperty(it[j].code)){
								it[j].checked = true;
							}
						}
					}
					this.$select_type.find(".content").html(this._templateType({
						types:types
					}));
					this.$select_type.css("display","block");
					this._status = "select_type";
				});
			},
			select_age_change:function(el,min,max,width,type,point){
				if(this._status =="select_age"){
					var late = Math.round(point.x * 100 /width);
					var eld = el.data("start");
					var min_late =Math.round(min.data("start").width * 100 /width);
					var mid_late =Math.round(eld.width * 100 /width); 
					var max_late =Math.round(max.data("start").width * 100 /width); 
					
					var start,stop,current;
					if(type == -1){
						if(min_late + late < 0){
							late = -min_late;
						}
						if(mid_late - late < 5){
							late = mid_late - 5;
						}
						start = min_late + late;
						current = mid_late - late;
						stop = start + current;
						min.width(start+ "%");
						el.width(current + "%");
					}
					else if (type == 1){
						if(max_late - late < 0){
							late = max_late;
						}
						if(mid_late + late < 5){
							late = -mid_late + 5;
						}
						stop = max_late - late;
						current = mid_late + late;
						start = 100 - stop - current;
						el.width(current + "%");
						max.width(stop + "%");
						stop = 100 - stop;
					}
					else{
						if(min_late + late < 0){
							late = -min_late;
						}
						if(max_late - late < 0){
							late = max_late;
						}
						start = min_late + late;
						stop = max_late - late;
						min.width(start+ "%");
						max.width(stop + "%");
						stop = 100 - stop;
					}
					var len = eld.data.length;
					var startPos = Math.round(start * len/100);
					var stopPos = Math.round(stop * len/100) - 1;
					var str = eld.data[startPos] +  eld.unit + "-" +  eld.data[stopPos] + eld.unit;
					el.find('[data-target="mm"]').html(str);
					this.$select_age.find("[name='select_show']").html(str);
					var t = el.attr("data-tag");
					var num = t[0],tmp;
					if(num == "1"){
						if(eld.data[stopPos] != eld.data[startPos]){
							tmp = "0000" + eld.data[stopPos];
							num += tmp.substr(tmp.length-4);
						}
						else{
							num += "0000";
						}
						tmp = "0000" + eld.data[startPos];
						num += tmp.substr(tmp.length-4);
					}
					else if (num == "2"){
						tmp = eld.data[stopPos];
						if(tmp != eld.data[startPos]){
							if(t[1] == "-"){
								if(Number(tmp)  >= 12){
									num += '01';
									tmp = Number(tmp) - 12;
								}
								else{
									num += '00';
								}
								num += (tmp < 10?'0':'') + tmp;
							}
							else{
								num += (tmp < 10?'0':'') + tmp + '00';
							}
						}
						else{
							num += "0000";
						}
						tmp = eld.data[startPos];
						if(t[1] == "-"){
							if(Number(tmp)  >= 12){
								num += '01';
								tmp = Number(tmp) - 12;
							}
							else{
								num += '00';
							}
							num += (tmp < 10?'0':'') + tmp;
						}
						else{
							num += (tmp < 10?'0':'') + tmp + '00';
						}
					}
					this.$select_age.data("result",num);
				}
			},
			select_type_change:function(el){
				if(this._status =="select_type"){ 
					var result = this.$select_type.data("result");
					var _el = $(el);
					if(!result){
						result = {};
						this.$select_type.data("result",result);
					}
					if(el.checked){
						result[_el.attr("data-value")] = _el.parent().text().trim();
					}
					else{
						delete result[_el.attr("data-value")];
					}
					var str = "";
					for(var k in result){
						str += (str && ",") + result[k];
					}
					this.$select_type.find("[name='select_show']").html("选择结果："+str);
				}
			},
			show: function() {
				var doc = this.options.document_info.deck();
				
				this.$title.val(doc.get("document_title")||"");
				this.$keywords.val(doc.get("document_keywords")||"");
				this.$describe.val(doc.get("document_describe")||"");
				this.$input.val(doc.get("document_image")||"");
				//适用age 记录库数字 1位标识(孕或出生) 4位to年月或周(0201表示两岁一个月) 4位from
				var age = Number(doc.get("document_age")),from,to,from_y,to_y;
				this.$age.data("value",age);

				var tag = JSON.parse(doc.get("document_tag") ||"{}");
				this.$tag.data("value",tag);
				//age = 200000200;
				this.refresh();
				
				//
				this.loadItem();

				return this.$el.modal('show');
			},
			refresh:function(){
				var age = Number(this.$age.data("value")),from,to,from_y,to_y;
				if(!age){
					this.$age.html("选择适应范围");
				}
				else{
					if(age < 200000000){
						//孕周
						to = Math.floor(age/10000) - 10000;
						from = age%10000;
						this.$age.html(from + "周 ~ " + (to && (to + "周") || "+" ));
					}
					else if (age < 300000000){
						//产
						to = Math.floor(age/10000) - 20000;
						to_y = Math.floor(to / 100);
						to = to % 100;
						from = age%10000;
						from_y = Math.floor(from/100);
						from = from % 100;
						if(from_y < 2){
							from += from_y * 12;
							to += to_y * 12;
							to = to > from ?to:0;
							this.$age.html(from + "个月 ~ " + (to && (to + "个月") || "+" ));
						}
						else{
							var tostr = (to + to_y * 12) > (from + from_y * 12)?(to_y  + "岁" + (to && (to  +  "个月 ")||"")):"+";_
							this.$age.html(from_y  + "岁" + (from && (from  +  "个月 ")||"") +  " ~ " + tostr);	
						}
					}
				}
				var tags = this.$tag.data("value");
				if(!tags){
					this.$tag.html("选择分类标签");
				}
				else{
					var str = "";
					for(var k in tags){
						str += (str && ",") + tags[k];
					}
					if(!str){
						this.$tag.html("选择分类标签");
					}
					else{
						this.$tag.html("分类："+str);
					}
				}
			},
			okClicked: function() {
				if(this._status == "select_age"){
					this.$age.data("value",Number(this.$select_age.data("result")));
					this.$select_age.css("display","none");
					this.refresh();
					this._status = "";
					return;
				}
				if(this._status == "select_type"){
					this.$tag.data("value",this.$select_type.data("result"));
					this.$select_type.css("display","none");
					this.refresh();
					this._status = "";
					return;
				}
				var doc = this.options.document_info.deck();

				doc.set("document_title",this.$title.val());
				doc.set("document_keywords",this.$keywords.val());
				doc.set("document_describe", this.$describe.val());
				doc.set("document_image", this.$input.val());
				doc.set("document_age",this.$age.data("value"));
				doc.set("document_tag",JSON.stringify(this.$tag.data("value")));
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
				if(this._status == "select_age"){
					this.$select_age.css("display","none");
				}
				else if(this._status == "select_type"){
					this.$select_type.css("display","none");
				}
				if (this.$input != null) {
					this.item.src = '';
					return this.$input.val("");
				}
				this._status = "";
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
				this.gid = (this.gid || 1)  + 1;
				this.$select_age = this.$el.find('[name="select_age" ]');
				this.$select_age_bars = this.$select_age.find(".progress .move");
				this.$select_age_bars.easymove(function(){
					_this.select_age_change.apply(_this,arguments);
				});

				this.$select_type = this.$el.find('[name="select_type" ]');
				if ( /msie/.test(navigator.userAgent.toLowerCase())) {
					this.$select_type.on("click.checkbox","input",function(){
						 this.blur();  
   						this.focus(); 
					});
				}
				this.$select_type.on("change.checkbox","input",function(){
					_this.select_type_change.call(_this,this);
				});

				this.$input = this.$el.find("input[name='image']");
				this.$title = this.$el.find("input[name='title']");
				this.$keywords = this.$el.find("input[name='keywords']");
				this.$describe = this.$el.find("textarea[name='describe']");

				this.$age = this.$el.find("div[name='age']");
				this.$tag = this.$el.find("div[name='tag']");

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