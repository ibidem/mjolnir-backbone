;(function (app, _) {

	/**
	 * @version 1.0.0
	 */
	var Auditor = app.Instantiatable.extend({

		_rules: null,

		options: {
			// empty
		},

		/**
		 * Validate fields.
		 */
		validate: function (fields) {
			var self = this,
				future = app.$.Deferred();

			if (this._rules == null && this.options.collection.__proto__.constructor._auditor_cache != null) {
				this._rules = this.options.collection.__proto__.constructor._auditor_cache;
			}

			if (this._rules == null) {
				app.$.ajax({url: this.options.collection.url, data: {'auditor': ''}})
					.done(function (response) {
						self._rules = response['rules'];
						self._process(fields)
							.done(function (resolution) {
								future.resolve(resolution);
							})
							.fail(function () {
								future.resolve(false);
							});
					})
					.fail(function () {
						future.resolve(false);
					});
			}
			else { // rules already loaded
				self._process(fields)
					.done(function (resolution) {
						future.resolve(resolution);
					})
					.fail(function () {
						future.resolve(false);
					});
			}

			return future.promise();
		},

		_process: function (fields) {
			var self = this,
				valid = true;

			var mainfuture = new app.$.Deferred();

			// check fields
			var fieldfutures = [];
			_.each(fields, function (field, fieldname) {
				var fieldfuture = new app.$.Deferred();

				if (self._rules[fieldname] != null) {
					var testfutures = [];
					_.each(self._rules[fieldname], function (error, rule) {
						if (self.options.collection['verify_'+rule] == null) {
							throw new app.Exception({
								message: 'Missing rule [verify_'+rule+'] in collection ['+self.options.collection.url+'].'
							})
						}

						var testpromise = self.options.collection['verify_'+rule](fieldname, field, fields);

						testpromise
							.done(function (valid) {
								if ( ! valid) {
									field.adderror(error);
									return false;
								}
								else { // valid
									return true;
								}
							})
							.fail(function () {
								field.adderror('Failed to validate.');
								return false;
							});

						testfutures.push(testpromise);
					});

					app.when_futures(testfutures).done(function () {
						var validfield = true;
						_.each(arguments, function (valid) {
							if ( ! valid) {
								validfield = false;
							}
						});

						fieldfuture.resolve(validfield);
					});
				}

				// is the field valid at the end?
				fieldfuture.done(function (validfield) {
					if (validfield) {
						field.purge_errors();
					}
				});

				fieldfutures.push(fieldfuture.promise());
			});

			app.when_futures(fieldfutures).done(function () {
				var validform = true;
				_.each(arguments, function (valid) {
					if ( ! valid) {
						validform = false;
					}
				});

				mainfuture.resolve(validform);
			});

			return mainfuture.promise();
		}

	});

	// export
	app.Auditor = Auditor;

}(window.Mjolnir, window._));