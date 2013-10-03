;(function (app, _) {

	var ens = app.ens + 'Popover';

////////////////////////////////////////////////////////////////////////////////

	/**
	 * @version 1.0.0
	 */
	var Popover = app.Renderable.extend({

		options: {

			// where to place the popup after detaching it; note this should
			// be outside of the main context to avoid style polution
			container: app.$temp,

		// jQuery position settings

			// what should happen on colision
			collision: 'flip flip',

			// which part of the element should move
			pin: 'left top',

			// which part of the pivot should be used as an anchor
			anchor: 'left bottom'

		},

		hooks: [
			'refresh' // function to be called every time display is called
		],

		initialize: function () {
			this.conf = _.extend({}, this.options);
			this.configure(this.conf);
		},

		configure: function (new_options) {
			// we add the new options
			this.conf = _.extend(this.conf, new_options);

			this.$el = $(this.conf.content).detach().hide();
			this.$pivot = $(this.conf.pivot);

			this.$el.on('click'+ens, function (event) {
				event.stopPropagation();
			});

			// setup dimentions
			if (this.conf.width != null) {
				this.$el.css('width', this.conf.width);
			}
			if (this.conf.height != null) {
				this.$el.css('height', this.conf.height);
			}

			// insert element into page
			$(this.conf.container).append(this.$el);
		},

		show: function () {
			this.$el.show();
			this.refresh.apply(this);
			this.$el.position({
				collision: this.conf.collision,
				my: this.conf.pin,
				at: this.conf.anchor,
				of: this.$pivot
			});
		},

		hide: function () {
			this.$el.hide();
		},

		destroy: function () {
			this.$el.remove();
		},

		refresh: function () {
			// call placeholder
		}

	});

	// export
	app.Popover = Popover;

}(window.Mjolnir, window.jQuery));