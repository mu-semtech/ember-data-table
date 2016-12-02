import Ember from 'ember';
import layout from '../templates/components/number-pagination';

export default Ember.Component.extend({
  layout,
  range: 10,
  min: Ember.computed('links', function() {
    return this.get('links')['first']['number'] || 0;
  }),
  max: Ember.computed('links', function() {
    return this.get('links')['last']['number'];
  }),
  hasPagination: Ember.computed('max', function() {
    return this.get('max') !== undefined;
  })
});
