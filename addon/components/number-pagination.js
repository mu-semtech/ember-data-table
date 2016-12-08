import Ember from 'ember';
import layout from '../templates/components/number-pagination';

export default Ember.Component.extend({
  layout,
  range: 10,
  min: Ember.computed('links', function() {
    return this.get('links')['first']['number'] || 1;
  }),
  max: Ember.computed('links', function() {
    const max = this.get('links')['last']['number'];
    return max ? max + 1 : max;
  }),
  current: Ember.computed('page', {
    get(key) {
      return this.get('page') ? this.get('page') + 1 : 1;
    },
    set(key, value) {
      this.set('page', value - 1);
      return value;
    }
  }),
  hasPagination: Ember.computed('max', function() {
    return this.get('max') !== undefined;
  })
});
