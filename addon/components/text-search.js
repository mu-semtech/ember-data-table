import Ember from 'ember';
import layout from '../templates/components/text-search';

export default Ember.Component.extend({
  layout,
  classNames: ['data-table-text-search', 'input-field'],
  filter: '',
  value: Ember.computed.oneWay('filter'),
  wait: 2000,
  auto: true,
  placeholder: 'Search',
  isExpanded: Ember.computed.oneWay('filter', function() {
    return this.get('filter').length > 0;
  }),
  _openSearch() {
    this.set('isExpanded', true);
    Ember.run.scheduleOnce('afterRender', this, function() {
      Ember.$('.data-table-text-search').focus();
    });
  },
  _closeSearch() {
    this.set('isExpanded', false);
    this.set('filter', '');
    this.set('value', '');
  },
  keyUp(e) {
    if (this.get('isExpanded') && e.keyCode === 27) { // escape
      this._closeSearch();
    }
  },
  actions: {
    toggleExpansion() {
      if (this.get('isExpanded')) { this._closeSearch(); } else { this._openSearch(); }
    },
    search() {
      this.set('filter', this.get('value'));
    }
  }
});
