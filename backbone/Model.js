;(function (app) {

	app.single = function (modelPrototype) {
		return function (attrs, options) {
			return modelPrototype.create(attrs, options);
		};
	};

	app.Model = Supermodel.Model.extend({

		// default options
		options: {
			// empty
		},

		/**
		 * Universal human readable text representation.
		 */
		title: function () {
			return this.get('title');
		},

		/**
		 * Universal keyfield retriever.
		 *
		 * @return string
		 */
		key: function () {
			return this.get('id');
		}

	});

	app.Model.View = app.View.extend({

		/**
		 * Object state.
		 */
		state: 'nominal',

		/**
		 * @return boolean is model saved?
		 */
		saved: function () {
			return this.model.has('id') && this.state == 'nominal';
		}

	})

}(window.Mjolnir));