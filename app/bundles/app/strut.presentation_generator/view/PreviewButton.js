define(['libs/backbone', '../PreviewLauncher','lang'],
function(Backbone, PreviewLauncher,lang) {
	return Backbone.View.extend({
		className: 'btn-group iconBtns',
		events: {
			'click .act': '_launch'
		},

		initialize: function() {
			this._editorModel = this.options.editorModel;
			this._previewLauncher = new PreviewLauncher(this._editorModel);
			this._generators = this._editorModel.registry
				.getBest('strut.presentation_generator.GeneratorCollection');
			//publish
			this._generators.push({
				displayName: lang.publish||'Send To Server',
				id: 'publish'
			});
			delete this.options.editorModel;
			// TODO: we should keep session meta per bundle...
			this._index = Math.min(window.sessionMeta.generator_index || 0, this._generators.length - 1);
			this._generatorChanged();

			this._template = JST['strut.presentation_generator/Button'];
		},

		_launch: function() {
			this._previewLauncher.launch(this._generators[this._index]);
		},

		_bind: function() {
			var self = this;
			this.$el.find('li').each(function(i) {
				var $btn = $(this);
				$btn.click(function(e) {
					if($btn.attr('data-option') == 'publish'){
						self._previewLauncher.publish(self._generators[self._index]);
						self.$el.find('.dropdown-toggle').dropdown('toggle');
						e.stopPropagation();
						return;
					}
					// self._previewLauncher.launch(self._generators[i]);
					self.$el.find('.check').css('visibility', 'hidden');
					$btn.find('.check').css('visibility', '');
					self._index = i;
					window.sessionMeta.generator_index = i;
					self._generatorChanged();
					self.$el.find('.dropdown-toggle').dropdown('toggle');
					e.stopPropagation();
				});
			});
		},

		/**
		* Need to inform the world of a generator update.
		* Some modes are only present for certain generators.
		*/
		_generatorChanged: function() {
			this._editorModel.set('generator', this._generators[this._index]);
			if (this._$readout)
				this._$readout.text(this._generators[this._index].displayName);
		},

		render: function() {
			this.$el.html(this._template({generators: this._generators, chosen: this._generators[this._index]}));
			this._bind();
			this._$readout = this.$el.find('.chosen');
			$(this.$el.find('.check')[this._index]).css('visibility', '');
			return this;
		}
	});
});