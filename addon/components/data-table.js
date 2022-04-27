import { typeOf } from '@ember/utils';
import { computed, observer } from '@ember/object';
import { bool, equal, oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../templates/components/data-table';

export default Component.extend({
  init() {
    this._super(...arguments);
    if (this.selection === undefined) this.set('selection', []);
  },
  layout,
  noDataMessage: 'No data',
  isLoading: false,
  lineNumbers: false,
  searchDebounceTime: 2000,
  enableLineNumbers: bool('lineNumbers'),
  enableSelection: oneWay('hasMenu'),
  selectionIsEmpty: equal('selection.length', 0),
  enableSizes: true,
  size: 5,
  sizeOptions: computed('size', 'sizes', 'enableSizes', function () {
    if (!this.enableSizes) {
      return null;
    } else {
      const sizeOptions = this.sizes || [5, 10, 25, 50, 100];
      if (!sizeOptions.includes(this.size)) {
        sizeOptions.push(this.size);
      }
      sizeOptions.sort((a, b) => a - b);
      return sizeOptions;
    }
  }),
  hasMenu: false, // set from inner component, migth fail with nested if
  enableSearch: computed('filter', function () {
    return this.filter || this.filter === '';
  }),
  autoSearch: true,
  filterChanged: observer('filter', function () {
    this.set('page', 0);
  }),
  sizeChanged: observer('size', function () {
    this.set('page', 0);
  }),
  parsedFields: computed('fields', function () {
    const fields = this.fields;
    if (typeOf(fields) === 'string') {
      return fields.split(' ');
    } else {
      return fields || [];
    }
  }),
  addItemToSelection(item) {
    this.selection.addObject(item);
  },
  removeItemFromSelection(item) {
    this.selection.removeObject(item);
  },
  clearSelection() {
    this.selection.clear();
  },
});
