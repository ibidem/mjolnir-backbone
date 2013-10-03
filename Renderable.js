;(function (app) {

	/**
	 * @version 1.0.0
	 */
	var Renderable = app.Instantiatable.extend({

	// -- Helpers -------------------------------------------------------------

		/**
		 * Shorthand for call $(selector, context), also avoids $ wrapping.
		 */
		$: function (selector) {
			return app.$(selector, this.$el);
		}

	});

	// export
	app.Renderable = Renderable;

}(window.Mjolnir));