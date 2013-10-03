;(function (app) {

	/**
	 * @version 1.0.0
	 */
	var Exception = app.Instantiatable.extend({

		// intentionally not passed as options array
		name: 'Mjolnir Exception',
		message: 'Unspecified Error',
		htmlMessage: 'Unspecified Error',

		initialize: function (options) {
			if (typeof options == 'string') {
				this.setmessage(options);
			}
			else { // assume object
				if (options.message != null) {
					this.setmessage(options.message);
				}
				if (options.name != null) {
					this.name = options.name;
				}
				if (options.htmlMessage != null) {
					this.htmlMessage = options.htmlMessage;
				}
			}
		},

		setmessage: function (message) {
			this.message = message;
			this.htmlMessage = message;
		},

		toString: function () {
			return this.name + ': ' + this.message;
		}

	});

// -- Export ------------------------------------------------------------------

	app.Exception = Exception;

}(window.Mjolnir));