;(function (app, $) {

	app.Collection = Backbone.Collection.extend({

		// set default Model class
		model: app.Model,

		// set default Auditor class
		auditor: app.Auditor,

		// default options
		options: {
			// empty
		},

		// inject loader hooks
		fetch: function (options) {
			var self = this;

			var xhrHandler;

			// is xhr defined?
			if (options != null && 'xhr' in options) {
				var customXhr = options.xhr;
				xhrHandler = function () {
					var xhr = customXhr();

					// browser supports W3C progress events?
					if ('onprogress' in xhr) {
						xhr.onprogress = function (p) {
							self.progressupdate(p, this);
						};
					}
					else { // not supported
						// do nothing; ie. stay in spinner state
					}

					return xhr;
				}
			}
			else { // no custom xhr or no options
				xhrHandler = function () {
					var xhr = $.ajaxSettings.xhr();

					// browser supports W3C progress events?
					if ('onprogress' in xhr) {
						xhr.onprogress = function (p) {
							self.progressupdate(p, this);
						};
					}
					else { // not supported
						// do nothing; ie. stay in spinner state
					}

					return xhr;
				}
			}

			// gurantee options were passed
			options != null || (options = {});
			options['xhr'] = xhrHandler;

			return Backbone.Collection.prototype.fetch.apply(this, [ options ]);
		},

		progressupdate: function (p, xhr) {
			if (this.loader != null) {
				this.loader.progressupdate(p, xhr);
			}
		},

		createauditor: function () {
			return new this.auditor({ collection: this });
		},

	// -- Events --------------------------------------------------------------

		addModel: function (model) {
			this.add(model);
			return model;
		},

		savedEntry: function (model, req) {
			// do nothing
		},

	// -- Verifiers -----------------------------------------------------------

		verify_not_empty: function (fieldname, field, fields) {
			var future = new $.Deferred();

			var value = field.value();
			if (value == null || value == '') {
				future.resolve(false);
			}
			else { // value is not empty
				future.resolve(true);
			}

			return future.promise();
		}

	});

}(window.Mjolnir, window.jQuery));