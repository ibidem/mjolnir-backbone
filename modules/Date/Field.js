;(function (app, _) {

	// namespace
	var ns = app.ns + '-Date-Field-',
		ens = app.ens + 'DateField';

////////////////////////////////////////////////////////////////////////////////

	/**
	 * General purpose Date field.
	 *
	 * @version 1.0.0
	 */
	app.Date.Field = app.Field.extend({

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
			return app.moment(this.date, app.formats.date).format('YYYY-MM-DD');
		},

		reset: function () {
			if (this.options.value != null) {
				this.date = app.moment(this.options.value).format(app.formats.date);
			}
			else { // no default
				// initialize field to today
				this.date = app.moment().format(app.formats.date);
			}
		},

	// -- Rendering -----------------------------------------------------------

		template: app.template('mjolnir-Date-Field'),

		render: function () {
			var self = this;
			console.log('render: Mjolnir.Date.Field');

			// clean previous render
			this.cleanup();

			// inject template
			this.markup(this.template(this));

			// setup field
			this.$field = this.$(ns+'field');

			// setup datepicker default
			this.$field.val(this.date);

			this.setupcontrols();

			// setup control toggle
			this.$field
				.off(ens)
				.on('click'+ens, function (event) {
					// prevent window manager from closing when trying to focus
					event.stopPropagation();
				})
				.on('focus'+ens, function (event, options) {
					var conf = _.extend({nohandling: false}, options);

					if (conf.nohandling) {
						return;
					}

					if (self.options.windows != null) {
						self.options.windows.closeAll();
					}

					self.showcontrols();

					event.stopPropagation();
				})
				.on('blur', function () {
					self.hidecontrols();
				});

			return this;
		},

		setupcontrols: function () {
			// required components already setup?
			if (app.Date.Field.popover != null) {
				this.popover = app.Date.Field.popover;
				this.datepicker = app.Date.Field.datepicker;
				// remove unnecesary code to keep dom node count low
				this.$(ns+'popup').remove();
				return;
			}

			// setup popup
			var $popup = this.$(ns+'popup'),
				$datepicker = this.$(ns+'datepicker', $popup);

			var popover = new app.Popover({
				content: $popup,
				width: 254,
				anchor: 'left bottom',
				pin: 'left top'
			});

			this.popover = app.Date.Field.popover = popover;

			var datepicker = new Pikaday({
				// [!!] intentionally not binding directly on $datefield
				format: app.formats.date
			});

			this.datepicker = app.Date.Field.datepicker = datepicker;

			$datepicker.empty();
			$datepicker.append(datepicker.el);
		},

		configure: function () {
			var self = this;

			// configure popover
			this.popover.configure({
				pivot: this.$field
			});

			// configure datepicker
			this.datepicker.setMoment(app.moment(this.date, app.formats.date));
			this.datepicker._o.onSelect = function(date) {
				self.$field.val(self.date = self.datepicker.toString());
			}
		},

		showcontrols: function () {
			this.$field.trigger('focus', {nohandling: true});

			this.configure();
			this.popover.show();

			var self = this;
			if (this.options.windows != null) {
				this.options.windows.push(function () {
					self.hidecontrols();
				});
			}
		},

		hidecontrols: function () {
			this.datepicker._o.onSelect = app.noop;
			this.popover.hide();
		}

	});

}(window.Mjolnir, window._));