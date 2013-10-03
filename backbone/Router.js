;(function (app, $, _) {
	
	app.Router = Backbone.Router.extend({
		
		// default options
		default_options: {
			root: null
		},
		
		// default constructor
		initialize: function (options) {
			this.conf = _.extend({}, this.default_options, options);
			this.$el = $(this.conf.root);
		},
		
		purge: function () {
			// remove current layouts from the dom with out 
			_.each(this.layout, function (layout) {
				if (layout !== null) {
					layout.$el.detach();
				}
			});
			
			// remove any additional elements
			this.$el.empty();
		},
		
		addcleaner: function (func) {
			if (this._cleanup == null) {
				this._cleanup = [];
			}
			
			this._cleanup.push(func);
		},
		
		cleanup: function () {
			// cleanup previous render
			if (this._cleanup != null) {
				_.each(this._cleanup, function (cleaner) { 
					cleaner(); 
				});
				
				this._cleanup = null;
			}
		}
		
	});
	
}(window.Mjolnir, window.jQuery, window._));