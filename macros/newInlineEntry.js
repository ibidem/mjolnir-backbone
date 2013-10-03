;(function (app, _) {

	/**
	 * Add inline editing capabilities.
	 *
	 * @version 1.0.0
	 */
	app.macros.newInlineEntry = function (self, entity, func_name, fields, modelclass, defaults) {

		if (defaults == null) {
			defaults = {};
		}

		self[func_name] = function () {
			var req;

			// build initial request
			req = _.extend({}, defaults);

			// get form data
			var valuePromises = [];
			_.each(fields, function (field, fieldname) {
				var future = new app.$.Deferred();

				future.then(function (value) {
					req[fieldname] = value;
				});

				try {
					app.$.when(field.value()).done(function (value) {
						future.resolve(value);
					});
				}
				catch (e) {
					console.log(e.toString());
					throw new app.Exception('Failed to get value for '+fieldname+' field.');
				}
			});

			app.when_futures(valuePromises).done(function () {
				var entry = new modelclass(req),
					model = self.collection.addModel(entry)

				model.save().done(function () {
					self.collection.savedEntry(model, req);
				});
			});

			// reset fields
			_.each(fields, function (field) {
				field.reset();
			});

			self.render();
		};
	};

}(window.Mjolnir, window._));