;(function (app, mjb, _) {

	// keys
	var ENTER_KEY = 13;

	// namespace
	var ns = app.ns + '-Currency-Field-',
		ens = app.ens + 'CurrencyField';

////////////////////////////////////////////////////////////////////////////////

	app.Currency._defaultFormat = {
		pos: '<span class="positive-value">%s %v</span>',
		neg: '<span class="negative-value">%s -%v</span>',
		zero: '<span class="zero-value">%s %v</span>'
	};

	app.Currency.format = function (value, type, theformat) {
		var moneyformat, format;

		format = _.extend({}, app.Currency._defaultFormat, theformat);

		if (type == null) {
			type = 'USD';
		}

		if (mjb.mjolnir.types.currency[type] == null) {
			throw new app.Exception('Currency Type ['+type+'] not registered.');
		}

		moneyformat = mjb.mjolnir.types.currency[type];
		return app.acc.formatMoney(value, {
			symbol: moneyformat.symbol,
			format: format,
			decimal : moneyformat.decimal,
			thousand: moneyformat.thousand,
			precision: moneyformat.precision
		});
	};

////////////////////////////////////////////////////////////////////////////////

	/**
	 * General purpose Currency field.
	 *
	 * @version 1.0.0
	 */
	app.Currency.Field = app.Field.extend({

		// controls opened?
		opened: false,
		// control fields
		fields: null,

		// currency code
		_type: 'USD',
		// currency value
		_value: null,

		// option defaults
		options: {
			// context: editor, transparent
			context: 'editor',
			// window manager
			windows: null,
			// preset value
			value: null
		},

		initialize: function () {
			this.reset();
		},

		value: function () {
			var future = new app.$.Deferred(),
				promises = [],
				value = {};

			_.each(this.fields, function (field, fieldname) {
				try {
					app.$.when(field.value()).done(function (val) {
						value[fieldname] = val;
					});
				}
				catch (e) {
					console.log(e.toString());
					throw new app.Exception({
						name: 'Mjolnir.Currency.Field Exception',
						message: 'Failed to get value of '+fieldname+' field'
					});
				}
			});

			app.when_futures(promises).done(function () {
				future.resolve(new app.Currency.Model(value));
			});

			return future.promise();
		},

		reset: function () {
			var money;

			this._type = 'USD';
			this._value = null;

			if (this.options.value != null) {
				money = this.options.value;
				this._type = money.type();
				this._value = money.value();
			}

			this.fields = {
				'value': new app.Text.Field({placeholder: '0.00', value: this._value}),
				'type': new app.Select.Field({value: this._type})
			};
		},

	// -- Rendering -----------------------------------------------------------

		template: app.template('mjolnir-Currency-Field'),

		render: function () {
			var self = this;
			console.log('render: Mjolnir.Currency.Field');

			// clean previous render
			this.cleanup();

			// inject template
			this.markup(this.template(this));

			if (this._value != null) {
				this.refreshAmount();
			}

			// setup field
			if (this.options.context !== 'transparent') {
				this.$toggle = this.$(ns+'toggle');
			}
			else { // transparent
				this.$toggle = this.$(ns+'value');
			}

			this.setupcontrols();

			// setup control toggle
			this.$toggle
				.off(ens)
				.on('click'+ens, function (event) {
					if (self.opened) {
						self.hidecontrols();
					}
					else { // not opened
						if (self.options.windows != null) {
							self.options.windows.closeAll();
						}

						self.showcontrols();
					}

					event.stopPropagation();
				});

			return this;
		},

		setupcontrols: function () {
			// required components already setup?
			if (app.Currency.Field.popover != null) {
				this.popover = app.Currency.Field.popover;
				// remove unnecesary code to keep dom node count low
				this.$(ns+'popup').remove();
				return;
			}

			var popover = new app.Popover({
				content: this.$(ns+'popup'),
				width: 250
			});

			this.popover = app.Currency.Field.popover = popover;
		},

		configure: function () {
			var self = this;

			// configure for current use
			this.popover.configure({
				pivot: this.$toggle
			});

			var $input = this.popover.$(ns+'input');
			$input.empty();
			$input.append(this.fields.value.render().el);

			var $type = this.popover.$(ns+'type');
			$type.empty();
			$type.append(this.fields.type.render().el);

			if (this._type == null) {
				this._type = 'USD';
			}

			var $typefield = this.fields.type.$field;
			$typefield.empty();
			_.each(mjb.mjolnir.types.currency, function (type, code) {
				var $option = '<option value="'+code+'">'+type['title']+'</option>';
				$typefield.append($option);
			});

			// deselect all
			app.$('option', $typefield)
				// deselect all
				.prop('selected', false);

			// select current
			app.$('option', $typefield)
				.filter(function() {
					return app.$(this).prop('value') == self._type;
				})
				.prop('selected', true);

			$typefield
				.off(ens)
				.on('change'+ens, function (event) {
					self._type = $typefield.val();
					self.refreshAmount();
				});

			if (this._value != null) {
				$typefield.val(this._type);
			}

			var $inputfield = this.fields.value.$field;
			$inputfield
				.off(ens)
				.on('input'+ens, function (event) {
					self._value = $inputfield.val();
					self.refreshAmount();
				})
				.on('keydown'+ens, function (event) {
					if (event.which == ENTER_KEY) {
						self.hidecontrols();
						self.options.parent.hotwireSave();
					}
				});

			if (this._value != null) {
				$inputfield.val(this._value);
			}

			// setup close button
			this.popover.$(ns+'close').on('click'+ens, function () {
				self.hidecontrols();
			});

			// setup deselect function
			this.popover.$(ns+'deselect').on('click'+ens, function () {
				self._value = null;
				self.refreshAmount();
				self.hidecontrols();
			});
		},

		showcontrols: function () {
			this.configure();
			this.popover.show();
			this.fields.value.$field.focus();
			this.opened = true;

			var self = this;
			if (this.options.windows != null) {
				this.options.windows.push(function () {
					self.hidecontrols();
				});
			}
		},

		hidecontrols: function () {
			this.popover.hide();
			this.opened = false;
		},

		refreshAmount: function () {
			this.$(ns+'value').html(app.Currency.format(this._value, this._type));
		}

	});

}(window.Mjolnir, window.mjb, window._));