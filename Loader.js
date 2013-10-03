;(function (app, _) {

	/**
	 * @version 1.0.0
	 */
	var Loader = app.Instantiatable.extend({

		_enabled: true,

		_loading: false,

		state: 'idle', // possible states: idle, loading, error, finished

		options: {
			enabled: true,
			view: null // optional
		},

		// methods that are overwritable directly in options; for others you
		// will have to extend the class to overwrite them since they are
		// considered internal and liable to change
		hooks: ['start', 'success', 'error', 'progressupdate'],

		initialize: function () {
			// models currently attached
			this.dependencies = [];

			if (this.options.view != null) {
				this.viewport = this.options.view
			}
			else { // didn't get a view'
				// fake view; if you need more complex operations always check
				// via this.options.view

				// since 99% of the time these are the only two operations
				// performed it's much easier to rely on the fact you can call
				// viewport with the given method regardless of if there is an
				// actuall view behind it makes for cleaner code -- this is
				// also why the attribute is called viewport and not view
				this.viewport = {
					markup: function () { /* do nothing */ },
					render: function () { return this; }
				}
			}

			this._enabled = this.options.enabled;
		},

		/**
		 * Shorthand for start followed by attach.
		 */
		watch: function (model) {
			this.attach(model);
			this.start();

			return this;
		},

		/**
		 * Shorthand for deactivation routines when finishing loading.
		 */
		end: function () {
			this.loadingstop();
			this.deactivate();
			this.destroy();

			return this;
		},

	// -- Public --------------------------------------------------------------

		start: function () {
			console.log('loader: spinning.');
			this.loadingstart();
		},

		success: function () {
			console.log('loader: success.');
			this.end(); // shorthand
			this.viewport.render();
		},

		error: function () {
			console.log('loader: failure.');
		},

		progressupdate: function (progress) {
			console.log('loader: progress...', Big(progress.loaded).toFixed(2) + '%');
		},

	// -- Internal ------------------------------------------------------------

		enabled: function () {
			return this._enabled;
		},

		activate: function () {
			if (this.state !== 'idle') {
				throw new app.Exception('Can only enable while in [idle] state; was in [' + this.state + '] state');
			}

			this._enabled = true;
			return this;
		},

		deactivate: function () {
			if (this.state !== 'idle' && this.state !== 'finished') {
				throw new app.Exception('Can only deactivate while in [idle] or [finished] state; was in [' + this.state + '] state');
			}

			this._enabled = false;
			return this;
		},

		loading: function () {
			return this._loading;
		},

		loadingstart: function () {
			if (this.state !== 'idle') {
				throw new app.Exception('Can only attach while in [idle] state; was in [' + this.state + '] state');
			}

			this._loading = true;
			this.state = 'loading';

			// did we have anything to load?
			if (this.dependencies.length == 0) {
				// we didnt need to load anything; automark as complete
				this.success();
			}

			return this;
		},

		loadingstop: function () {
			if (true && this.state !== 'loading') {
				throw new app.Exception('Can only stop loading while in [loading] state; was in [' + this.state + '] state');
			}

			this._loading = false;
			this.state = 'finished';
			return this;
		},

		attach: function (model) {
			var self = this;

			if (this.state !== 'idle') {
				throw new app.Exception('Can only attach while in [idle] state; was in [' + this.state + '] state');
			}

			var loader_entry = { done: false };
			this.dependency(loader_entry);

			// attach loader
			model.on('request', function (targetmodel, xhr, options) {
				xhr.then(function () {
					loader_entry.done = true;
					self.refresh();
				},
				// onError:
				function () {
					if (self.enabled() && self.state !== 'error') {
						self.invalidate();
					}
				});
			});

			return this;
		},

		invalidate: function () {
			this.state = 'error';
			this.error();
		},

		destroy: function () {
			// do nothing
		},

		dependency: function (entry) {
			this.dependencies.push(entry);
		},

		refresh: function () {
			if (this.enabled() && self.state !== 'error') {
				if (this.dependencies.length == 1) {
					// yey, we're done!
					this.progressupdate({loaded: 100, total: 100, type: '%'});
					this.success();
				}
				else { // we need to check
					var total = this.dependencies.length;
					var loaded = 0;

					_.each(this.dependencies, function (entry) {
						loaded += entry.done ? 1 : 0;
					});

					if (loaded == total) {
						// yey, we're done!
						this.progressupdate({loaded: 100, total: 100, type: '%'});
						this.success();
					}
					else { // partial progress
						var percent_done = loaded * 100 / total;
						this.progressupdate({loaded: percent_done, total: 100, type: '%'});
					}
				}
			}
		}

	});

	// export
	app.Loader = Loader;

}(window.Mjolnir, window._));