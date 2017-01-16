import Ember from 'ember';
import layout from '../templates/components/data-table';

export default Ember.Component.extend({
  layout: layout,
  noDataMessage: 'No data',
  pagination: 'number', // page or number
  isNumberPagination: Ember.computed.equal('pagination', 'number'),
  range: 10,
  lineNumbers: true,
  hasPagination: Ember.computed.bool('content.meta.pagination'),
  enableLineNumbers: Ember.computed.bool('lineNumbers'),
  selection: [],
  hasMenu: false, // set from inner component, migth fail with nested if
  hasSearch: Ember.computed('filter', function() {
    return this.get('filter') || this.get('filter') === '';
  }),
  autoSearch: true,
  filterChanged: Ember.observer('filter', function() {
    this.set('page', 0);
  }),
  enableSelection: Ember.computed.oneWay('hasMenu'),
  parsedFields: Ember.computed('fields', function() {
    const fields = this.get('fields');
    if( Ember.typeOf( fields ) === 'string' ) {
      return fields.split(' ');
    } else {
      return fields || [];
    }
  }),
  addItemToSelection(item) {
    this.get('selection').addObject(item);
  },
  removeItemFromSelection(item) {
    this.get('selection').removeObject(item);
  },
  clearSelection() {
    this.get('selection').clear();
  }
});
