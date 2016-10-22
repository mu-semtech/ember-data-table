import Ember from 'ember';
import layout from '../templates/components/data-table-menu-selected';

export default Ember.Component.extend({
  layout,
  selectionCount: Ember.computed('selection', function() {
    return this.get('selection.length');
  }),
  actions: {
    clearSelection() {
      this.get('selection').setEach('isSelected', false);
    }
  }

});
