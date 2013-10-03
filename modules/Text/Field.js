;(function (app) {

	// namespace
	var ns = app.ns + '-Text-Field-',
		ens = app.ens + 'TextField';

////////////////////////////////////////////////////////////////////////////////

	/**
	 * General purpose Text field.
	 *
	 * @version 1.0.0
	 */
	app.Text.Field = app.Field.extend({

		// text field
		$field: null,

		// field value
		_value: '',

		// option defaults
		options: {
			// display type: standard, area
			display: 'standard',
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
			return this._value;
		},

		reset: function () {
			if (this.options.value != null) {
				this._value = this.options.value;
			}
			else {
				this._value = '';
			}
		},

	// -- Rendering -----------------------------------------------------------

		template: app.template('mjolnir-Text-Field'),

		render: function () {
			var self = this;

			console.log('render: Mjolnir.Text.Field');

			this.markup(this.template(this));

			this.$field = this.$(ns+'field');

			if (this._value != null) {
				this.$field.val(this._value);
			}

			this.$field
				.off(ens)
				.on('input'+ens, function (event) {
					self._value = self.$field.val();
				});

			this.$error = this.$(ns+'error');

			if (this.options.placeholder != null) {
				this.$field.prop('placeholder', this.options.placeholder);
			}

			return this;
		},

		adderror: function (error) {
			this.$error.empty();
			this.$error.append(error);
			this.$error.removeClass('app-hidden');
		},

		purge_errors: function () {
			this.$error.empty();
			this.$error.addClass('app-hidden');
		}

	});

}(window.Mjolnir));