;(function (app) {

	/**
	 * @version 1.0.0
	 */
	var Field = app.View.extend({

		/**
		 * Method may return $.Deffered or normal value.
		 *
		 * Use $.when to mitigate, and always handle as deferred.
		 *
		 * ie. $.when(field.value()).done(function (val) { ... });
		 *
		 * This allows simple implementations to just return a value and stay
		 * simple.
		 */
		value: function () {
			throw new app.Exception('Not Supported');
		},

		/**
		 * All settings, values, etc go to original state.
		 */
		reset: function () {
			// do nothing
		},

		/**
		 * Add an error to the field.
		 */
		adderror: function (error) {
			// do nothing
		},

		/**
		 * Remove all errors.
		 */
		purge_errors: function () {
			// do nothing
		},

		/**
		 * Show editor controls.
		 */
		showcontrols: function () {
			// do nothing
		},

		/**
		 * Hide editor controls.
		 */
		hidecontrols: function () {
			// do nothing
		}

	});

	// export
	app.Field = Field;

}(window.Mjolnir));