import Ember from 'ember';
import layout from '../templates/components/text-search';

export default Ember.Component.extend({
  layout,
  classNames: ['input-field'],
  value: '',
  wait: 500,
  placeholder: 'Search',
  isExpanded: Ember.computed.oneWay('value', function() {
    return this.get('value').length > 0;
  }),
  click() {
    this.toggleProperty('isExpanded');
    if (this.get('isExpanded')) {
      Ember.run.scheduleOnce('afterRender', this, function() {
        Ember.$('.data-table-text-search').focus();
      });
    } else {
      this.set('value', '');
    }
  },
  keyUp(e) {
    if (this.get('isExpanded') && e.keyCode === 27) {
      this.toggleProperty('isExpanded');
      this.set('value', '');
    }
  }
});
