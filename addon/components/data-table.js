import Ember from 'ember';
import layout from '../templates/components/data-table';

export default Ember.Component.extend({
  layout: layout,
  noDataMessage: 'No data',
  isLoading: false,
  lineNumbers: false,
  enableLineNumbers: Ember.computed.bool('lineNumbers'),
  enableSelection: Ember.computed.oneWay('hasMenu'),
  selection: [],
  selectionIsEmpty: Ember.computed('selection.[]', function() {
    return this.get('selection.length') === 0;
  }),
  enableSizes: true,
  sizeOptions: Ember.computed('size', 'sizes', 'enableSizes', function() {
    if (!this.get('enableSizes')) {
      return null;
    } else {
      const sizeOptions = this.get('sizes') || [5, 10, 25, 50, 100];
      if (!sizeOptions.includes(this.get('size'))) {
        sizeOptions.push(this.get('size'));
      }
      sizeOptions.sort((a, b) => a - b);
      return sizeOptions;
    }
  }),
  hasMenu: false, // set from inner component, migth fail with nested if
  enableSearch: Ember.computed('filter', function() {
    return this.get('filter') || this.get('filter') === '';
  }),
  autoSearch: true,
  filterChanged: Ember.observer('filter', function() {
    this.set('page', 0);
  }),
  sizeChanged: Ember.observer('size', function() {
    this.set('page', 0);
  }),
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
  },
  onClickRow() { }
});
