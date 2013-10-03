// base declartion
window.Mjolnir = {};

// bootstrap
;(function (app, $, acc, moment, _) {

	app.ns = '.mj';

	// [E]vent [N]ame[s]pace
	app.ens = '.Mjolnir.';

	// default temporary markup location
	app.$temp = $('#temp');

	// assign default jquery
	app.$ = $;

	// assign default accounting
	app.acc = acc;

	// assign default moment.js
	app.moment = moment;

	// helper functions
	app.fn = {
		cap: function (str) {
			return str.charAt(0).toUpperCase() + str.substring(1).toLowerCase();
		}
	};

	// current application windows
	app.windows = [];

	// "no operation" shortcut
	app.noop = function () { /* do nothing */ };

	// close all windows
	app.windows.closeAll = function () {
		console.log('Mjolnir Window Manager -> Close All Windows');
		// close all windows
		_.each(app.windows, function (handler) {
			handler();
		});
		// windows closed; reset
		app.windows.length = 0;
	};

	// close windows handler
	app.$('html').on('click', function () {
		app.windows.closeAll();
	});

	// general purpose namespace (Fields, etc)
	app.Any = {};

	// setup macro namespace
	app.macros = { field: {} };

	// formats
	app.formats = {
		date: 'YYYY-MM-DD'
	};

	app.template = function (template) {
		try {
			return _.template($('#' + template + '-template').html());
		}
		catch (e) {
			console.log('failed to compile ' + template);
			throw e;
		}
	};

	// shorthand & pretty syntax for calling $.when using an array
	app.when_futures = function (futures_array) {
		return $.when.apply($, futures_array);
	};

	// Backbone's extend function
	app.extend = function(protoProps, staticProps) {

		var parent = this;
		var child;

		// The constructor function for the new subclass is either defined by you
		// (the "constructor" property in your `extend` definition), or defaulted
		// by us to simply call the parent's constructor.
		if (protoProps && _.has(protoProps, 'constructor')) {
		  child = protoProps.constructor;
		} else {
		  child = function(){ return parent.apply(this, arguments); };
		}

		// Add static properties to the constructor function, if supplied.
		_.extend(child, parent, staticProps);

		// Set the prototype chain to inherit from `parent`, without calling
		// `parent`'s constructor function.
		var Surrogate = function(){ this.constructor = child; };
		Surrogate.prototype = parent.prototype;
		child.prototype = new Surrogate;

		// Add prototype properties (instance properties) to the subclass,
		// if supplied.
		if (protoProps) _.extend(child.prototype, protoProps);

		// Set a convenience property in case the parent's prototype is needed
		// later.
		child.__super__ = parent.prototype;

		return child;
	};

	// namespaces
	app.Currency = {};
	app.Date = {};
	app.Color = {};
	app.Select = {};
	app.Text = {};

}(window.Mjolnir, window.jQuery, window.accounting, window.moment, window._));