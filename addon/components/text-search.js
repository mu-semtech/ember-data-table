import { isEqual } from '@ember/utils';
import { cancel, debounce } from '@ember/runloop';
import { observer } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../templates/components/text-search';

export default Component.extend({
  layout,
  filter: '',
  classNames: ['data-table-search'],
  internalValue: oneWay('filter'),
  auto: true,
  placeholder: 'Search',
  init() {
    this._super(...arguments);
    this.set('value', this.filter);
  },
  onValueChange: observer('value', function () {
    this._valuePid = debounce(this, this._setFilter, this.wait);
  }),
  onFilterChange: observer('filter', function () {
    // update value if filter is update manually outsite this component
    if (
      !this.isDestroying &&
      !this.isDestroyed &&
      !isEqual(this.filter, this.value)
    ) {
      this.set('value', this.filter);
    }
  }),
  _setFilter() {
    if (!this.isDestroying && !this.isDestroyed) {
      this.set('filter', this.value);
    }
  },
  willDestroy() {
    this._super(...arguments);
    cancel(this._valuePid);
  },
});
