;(function (app, $, _) {

	app.View = Backbone.View.extend({

		// default options
		default_options: {
			// empty
		},

		options: {
			'test': 'test'
		},

		// default constructor
		initialize: function (options) {
			this.conf = _.extend({}, this.default_options, options);
		},

		// copy events from one element to another
//		_copyEvents: function (src, dest) {
//			if (dest.nodeType !== 1 || ! Backbone.$.hasData(src)) {
//				return;
//			}
//
//			var type, i, l,
//			oldData = Backbone.$._data(src),
//			curData = Backbone.$._data(dest, oldData),
//			events = oldData.events;
//
//			if (events) {
//				delete curData.handle;
//				curData.events = {};
//
//				for (type in events) {
//					for (i = 0, l = events[type].length; i < l; i++) {
//						Backbone.$.event.add(dest, type, events[type][i]);
//					}
//				}
//			}
//
//			// make the cloned public data object a copy from the original
//			if (curData.data) {
//				curData.data = Backbone.$.extend({}, curData.data);
//			}
//		},

		// replace current root element with given el, and copies events from
		// current root element to new element
		markup: function (new_el) {
			if (new_el instanceof Backbone.$) {
				new_el = new_el.get(0);
			}
			else if (typeof new_el === 'string') {
				new_el = $(new_el.trim()).get(0);
			}

//			this._copyEvents(this.el, new_el);
			this.$el.replaceWith(new_el);
			this.el = new_el;
			this.$el = Backbone.$(this.el);
			this.undelegateEvents();
			this.delegateEvents();
		},

		addcleaner: function (func) {
			if (this._cleanup == null) {
				this._cleanup = [];
			}

			this._cleanup.push(func);
		},

		cleanup: function () {
			// cleanup previous render
			if (this._cleanup != null) {
				_.each(this._cleanup, function (cleaner) {
					cleaner();
				});

				this._cleanup = null;
			}
		},

		destroy: function () {
			this.cleanup();
			this.kill();
		},

		kill: function () {
			this.remove();
			this.unbind();
		}

	});

}(window.Mjolnir, window.jQuery, window._));