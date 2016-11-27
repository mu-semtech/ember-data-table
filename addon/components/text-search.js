import Ember from 'ember';
import layout from '../templates/components/text-search';

export default Ember.Component.extend({
  layout,
  classNames: ['data-table-text-search', 'input-field'],
  value: '',
  wait: 500,
  placeholder: 'Search',
  isExpanded: Ember.computed.oneWay('value', function() {
    return this.get('value').length > 0;
  }),
  keyUp(e) {
    if (this.get('isExpanded') && e.keyCode === 27) {
      this.toggleProperty('isExpanded');
      this.set('value', '');
    }
  },
  actions: {
    toggleExpansion() {
      if (this.get('isExpanded')) {
        this.set('isExpanded', false);
        this.set('value', '');
      } else {
        this.set('isExpanded', true);
        Ember.run.scheduleOnce('afterRender', this, function() {
          Ember.$('.data-table-text-search').focus();
        });
      }
    }
  }
});
