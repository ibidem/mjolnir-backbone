;(function (app, _) {

	/**
	 * Add placholders to object.
	 *
	 * @version 1.0.0
	 */
	app.macros.field.placeholders = function (self, fields) {
		_.each(fields, function (field) {
			if (self[field] == null) {
				self[field] = function () {
					return '[placholder:'+field+']';
				};
			}
		});
	};

}(window.Mjolnir, window._));
