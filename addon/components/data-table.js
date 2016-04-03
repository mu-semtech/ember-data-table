import Ember from 'ember';
import layout from '../templates/components/data-table';

export default Ember.Component.extend({
  layout: layout,
  
  headerMenu: [],
  selectionMenu: [],
  contextMenu: [],
  tableHeaderActions: { isTableHeaderActions: true },
  dateFormat: 'DD/MM/YYYY hh:mm:ss',
  noDataMessage: 'No data',
  
  selection: Ember.computed.filterBy('rows', 'isSelected', true),
  selectionCount: Ember.computed('selection', function() {
    return this.get('selection.length');
  }),
  selectionIsEmpty: Ember.computed('selectionCount', function() {
    return this.get('selectionCount') === 0;
  }),
  
  actions: {
    clearSelection() {
      this.get('selection').setEach('isSelected', false);
    },
    applyOnSelection(action, selection) {
      selection.setEach('isSelected', false);
      this.sendAction(action, selection);
    },
    applyOnRow(action, row) {
      this.sendAction(action, row);
    }
  }
});
