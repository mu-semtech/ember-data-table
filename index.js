/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-data-table',
  included: function(app) {
    this._super.included(app);

    if (app.import) {
      this.importDependencies(app);
    }
  },
  importDependencies: function(app) {
    app.import('vendor/tether/tether.js');
  }
};


