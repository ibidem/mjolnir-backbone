;(function (app, _) {

	// namespace
	var ns = app.ns + '-Color-Field-',
		ens = app.ens + 'ColorField';

////////////////////////////////////////////////////////////////////////////////

	/**
	 * General purpose Color field.
	 *
	 * @version 1.0.0
	 */
	app.Color.Field = app.Field.extend({

		// color value
		_color: '#666',

		// option defaults
		options: {
			// context: editor, transparent
			context: 'editor',
			// window manager
			windows: null,
			// default value
			value: null
		},

		initialize: function () {
			this.reset();
		},

		value: function () {
			return this._color;
		},

		reset: function () {
			if (this.options.value != null) {
				this._color = this.options.value;
			}
			else { // default
				this._color = '#666666';
			}
		},

	// -- Rendering -----------------------------------------------------------

		template: app.template('mjolnir-Color-Field'),

		render: function () {
			var self = this;

			console.log('render: Mjolnir.Color.Field');

			// clean previous render
			this.cleanup();

			// inject template
			this.markup(this.template(this));

			// setup field
			this.$field = this.$(ns+'field');

			// setup colorpicker default
			this.$field.val(this._color);

			// setup control toggle
			this.$field
				.off(ens)
				.on('click'+ens, function (event) {
					// prevent window manager from closing when trying to focus
					event.stopPropagation();
				})
				.on('change'+ens, function () {
					console.log('DEBUG', $(this).val());
					self._color = $(this).val();
				})
				.on('focus'+ens, function (event, options) {
					var conf = _.extend({nohandling: false}, options);

					if (conf.nohandling) {
						return;
					}

					if (self.options.windows != null) {
						self.options.windows.closeAll();
					}

					event.stopPropagation();
				});

			return this;
		}

	});

}(window.Mjolnir, window._));