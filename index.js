/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-mu-datatable',
  included: function(app) {
    this._super.included(app);

    if (app.import) {
      this.importDependencies(app);
    }
  },
  importDependencies: function(app) {
    app.import('vendor/tether/tether.js');
  },
  isDevelopingAddon: function() {
    return true;
  }
};


