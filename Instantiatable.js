;(function (app, _) {

	/**
	 * @version 1.0.0
	 */
	var Instantiatable = function (options) {
		// standard options or special case?
		if (_.isObject(options)) {
			this._configure(options || {});
		}

		// passing options just for special circumstances such as app.Exception
		// needing to accept strings; if your class doesn't use special option
		// cases avoid recieving the raw options! it will only cause errors and
		// confusion, since you'll have both `this.options` and `options` in
		// the same context
		this.initialize(options);
	};

	Instantiatable.prototype = {

		// default options; the constructor will automatically parse the passed
		// in options so that when you access this.options you will get the
		// options bellow merged with the options passed in by the user
		options: {
			// empty
		},

		hooks: [

			// function names you wish to allow to be overwritten, or otherwise
			// any other value you want to be directly attached to the object

			// we don't just overwrite everything since you usually won't want
			// to maintain all methods you use; in particular _underscore
			// methods (ie. internal/private ones); people will still be able
			// to overwrite them though a class which is advantegious since if
			// they need it and we got rid of it they can simply provide it
			// though the extended class, rather then go though their entire
			// project for use cases of the particular function

		],

		_configure: function(options) {
			options = _.extend({}, _.result(this, 'options'), options);
			_.extend(this, _.pick(options, this.hooks));
			this.options = options;
		},

		/**
		 * Initialize object.
		 */
		initialize: function () {
			// call placeholder
		},

		/**
		 * Remove all traces of object from the dom and other places.
		 */
		destroy: function () {
			// call placeholder
		}

	};

	Instantiatable.extend = app.extend;

	// export
	app.Instantiatable = Instantiatable;

}(window.Mjolnir, window._));