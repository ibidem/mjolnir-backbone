;(function (app, _) {

	var ENTER_KEY = 13;

////////////////////////////////////////////////////////////////////////////////

	/**
	 * Add inline editing capabilities.
	 *
	 * @version 1.0.0
	 */
	app.macros.inlineEditing = function (self, fields, fieldclasses, entity) {
		// click to start editing
		_.each(fields, function (field) {
			self.events['click .app-'+field+' .app-value'] = 'edit' + app.fn.cap(field);
		});
		// general operations
		self.events['click .app-edit-'+entity] = 'edit'+app.fn.cap(entity);
		self.events['click .app-save-'+entity] = 'save'+app.fn.cap(entity)+'Edits';
		self.events['click .app-cancel-'+entity] = 'cancel'+app.fn.cap(entity)+'Edits';
		self.events['keypress .app-input input'] = 'inline'+app.fn.cap(entity)+'EditSpecialKeys';
		// edit handlers
		var edit_func = 'switchTo'+app.fn.cap(entity)+'FieldEditMode';
		self[edit_func] = function (field, nofocus) {
			if (this.saved()) {
				this.$('.app-'+field+' .app-value').addClass('app-hidden');
				this.$('.app-'+field+' .app-input').removeClass('app-hidden');
				this.$('.app-controls .app-general').addClass('app-hidden');
				this.$('.app-controls .app-edit').removeClass('app-hidden');
				// focus on field
				this['configure'+app.fn.cap(field)+'Field'](nofocus);

				this.$el.removeClass('saved');
				this.$el.addClass('unsaved');

				return true;
			}
			else { // unsaved
				return false;
			}
		};
		// single field edit handlers
		_.each(fields, function (field) {
			var func_name = 'edit'+app.fn.cap(field);
			if (self[func_name] == null) {
				self[func_name] = function (event, nofocus) {
					self[edit_func](field, nofocus);
					if (event != null) {
						event.stopPropagation();
					}
				};
			}
		});
		// field configuration handler
		_.each(fields, function (field) {
			var func_name = 'configure'+app.fn.cap(field)+'Field';
			if (self[func_name] == null) {
				self[func_name] = function (nofocus) {
					var fieldhandler = new fieldclasses[field]({
						value: this.model.get(field),
						context: 'transparent',
						windows: app.windows
					});

					if (this.fields == null) {
						this.fields = {};
					}

					this.fields[field] = fieldhandler;

					this.$('.app-'+field+' .app-input').append(fieldhandler.render().el);

					if (nofocus == null || nofocus == false) {
						app.windows.closeAll();
						fieldhandler.showcontrols();
					}
				};
			}
		});
		// edit all fields
		if (self['edit'+app.fn.cap(entity)] == null) {
			self['edit'+app.fn.cap(entity)] = function () {
				_.each(fields, function (field) {
					self['edit'+app.fn.cap(field)](null, true);
				});
			};
		}
		// cancel edit
		if (self['cancel'+app.fn.cap(entity)+'Edits'] == null) {
			self['cancel'+app.fn.cap(entity)+'Edits'] = function () {
				self.render();
			};
		}
		// special key handling
		if (self['inline'+app.fn.cap(entity)+'EditSpecialKeys'] == null) {
			self['inline'+app.fn.cap(entity)+'EditSpecialKeys'] = function (event) {
				if (event.which === ENTER_KEY) {
					self['save'+app.fn.cap(entity)+'Edits']();
				}
			};
		}
		// save handling
		if (self['save'+app.fn.cap(entity)+'Edits'] == null) {
			self['save'+app.fn.cap(entity)+'Edits'] = function () {
				// get form data
				var self = this,
					valuePromises = [],
					req = {};

				if (this.fields != null) {
					_.each(this.fields, function (field, fieldname) {
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
							throw new app.Exception('Failed to get value for '+fieldname+' field.');
						}
					});

					app.when_futures(valuePromises).done(function () {
						// update interface
						self.model.set(req);
						self.state = 'updating';
						self.render();
						// persist changes
						self.model.save(req, {patch: true}).success(function () {
							self.state = 'nominal';
							self.render();
						});
					});
				}
				else { // no fields
					self.state = 'nominal';
					self.render();
				}
			}
		}
	};

}(window.Mjolnir, window._));
