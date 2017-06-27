import Ember from 'ember';
import layout from '../templates/components/number-pagination';

export default Ember.Component.extend({
  layout,
  classNames: ['data-table-pagination'],
  currentPage: Ember.computed('page', {
    get() {
      return this.get('page') ? parseInt(this.get('page')) + 1 : 1;
    },
    set(key, value) {
      this.set('page', value - 1);
      return value;
    }
  }),
  firstPage: Ember.computed('links', function() {
    return this.get('links')['first']['number'] || 1;
  }),
  lastPage: Ember.computed('links', function() {
    const max = this.get('links')['last']['number'];
    return max ? max + 1 : max;
  }),
  isFirstPage: Ember.computed('firstPage', 'currentPage', function() {
    return this.get('firstPage') == this.get('currentPage');
  }),
  isLastPage: Ember.computed('lastPage', 'currentPage', function() {
    return this.get('lastPage') == this.get('currentPage');
  }),
  hasMultiplePages: Ember.computed('lastPage', function() {
    return this.get('lastPage') !== undefined;
  }),
  startItem: Ember.computed('size', 'currentPage', function() {
    return this.get('size') * (this.get('currentPage') - 1) + 1;
  }),
  endItem: Ember.computed('startItem', 'nbOfItems', function() {
    return this.get('startItem') + this.get('nbOfItems') - 1;
  }),
  pageOptions: Ember.computed('firstPage', 'lastPage', function() {
    const nbOfPages = this.get('lastPage') - this.get('firstPage') + 1;
    return Array.from(new Array(nbOfPages), (val, index) => this.get('firstPage') + index);
  }),
  actions: {
    changePage(link) {
      this.set('page', link['number'] || 0);
    }
  }
});
