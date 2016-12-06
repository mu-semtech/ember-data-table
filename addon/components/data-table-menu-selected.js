import Ember from 'ember';
import layout from '../templates/components/data-table-menu-selected';

export default Ember.Component.extend({
  layout,
  init: function() {
    this._super( ...arguments );
    this.set('data-table.enableSelection', true);
  },
  selectionCount: Ember.computed('data-table.selection.[]', function() {
    return this.get('data-table.selection.length');
  }),
  actions: {
    clearSelection() {
      this.get('data-table').clearSelection();
    }
  }

});
