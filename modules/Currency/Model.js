;(function (app) {

	app.Currency.Model = app.Model.extend({

		value: function () {
			return this.get('value');
		},

		type: function () {
			return this.get('type') != null ? this.get('type') : 'USD';
		},

		toJSON: function () {
			return {
				value: this.get('value'),
				type: this.get('type')
			};
		}

	});

}(window.Mjolnir));
