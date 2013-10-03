;(function (app) {

	// namespace
	var ns = app.ns + '-Select-Field-',
		ens = app.ens + 'SelectField';

	/**
	 * General purpose Select field.
	 *
	 * @version 1.0.0
	 */
	app.Select.Field = app.Field.extend({

		// select field
		$field: null,

		// selected value
		_value: null,

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
			if (this.$field != null) {
				return this._value;
			}
			else {
				return null;
			}
		},

		reset: function () {
			this._value = this.options.value;
		},

	// -- Rendering -----------------------------------------------------------

		template: app.template('mjolnir-Select-Field'),

		render: function () {
			var self = this;

			console.log('render: Mjolnir.Select.Field');

			this.markup(this.template(this));

			this.$field = this.$(ns+'field');
			this.$error = this.$(ns+'error');

			// preselect value
			if (this._value != null) {
				app.$('option', this.$field)
					// deselect
					.prop('selected', false)
					.end()
					// select current value
					.filter(function() { return app.$(this).prop('value') == self._value; })
					.prop('selected', true);

			}

			this.$field
				.off(ens)
				.on('change'+ens, function (event) {
					self._value = self.$field.val();
				});

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