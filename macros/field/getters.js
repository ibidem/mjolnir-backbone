;(function (app, _) {

	/**
	 * Add getters to object.
	 *
	 * @version 1.0.0
	 */
	app.macros.field.getters = function (self, fields) {
		_.each(fields, function (field) {
			if (self[field] == null) {
				self[field] = function () {
					return this.get(field);
				}
			}
		});
	};

}(window.Mjolnir, window._));
