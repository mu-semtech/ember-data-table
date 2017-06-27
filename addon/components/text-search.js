import Ember from 'ember';
import layout from '../templates/components/text-search';

export default Ember.Component.extend({
  layout,
  filter: '',
  classNames: ["data-table-search"],
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
      this.$('input').focus();
    });
  },
  _closeSearch() {
    this.set('isExpanded', false);
    this.set('filter', '');
    this.set('value', '');
    Ember.run.scheduleOnce('afterRender', this, function() {
      this.$('input').focusout();
    });
  },
  click() {
    if (this.get('isExpanded')) { this._closeSearch(); } else { this._openSearch(); }
  },
  keyUp(e) {
    if (this.get('isExpanded') && e.keyCode === 27) { // escape
      this._closeSearch();
    }
    else if (!this.get('auto') && this.get('isExpanded') && e.keyCode === 13) { // enter
      this.set('filter', this.get('value')); // trigger non-automatic search
    }
  },
  actions: {
    toggleExpansion() {
      if (this.get('isExpanded')) { this._closeSearch(); } else { this._openSearch(); }
    },

  }
});
