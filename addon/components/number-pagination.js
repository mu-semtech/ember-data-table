import { computed } from '@ember/object';
import { gt } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../templates/components/number-pagination';

export default Component.extend({
  layout,
  classNames: ['data-table-pagination'],
  currentPage: computed('page', {
    get() {
      return this.page ? parseInt(this.page) + 1 : 1;
    },
    set(key, value) {
      this.set('page', value - 1);
      return value;
    },
  }),
  firstPage: computed('links.first.number', function () {
    return this.get('links.first.number') || 1;
  }),
  lastPage: computed('links.last.number', function () {
    const max = this.get('links.last.number') || -1;
    return max ? max + 1 : max;
  }),
  isFirstPage: computed('firstPage', 'currentPage', function () {
    return this.firstPage == this.currentPage;
  }),
  isLastPage: computed('lastPage', 'currentPage', function () {
    return this.lastPage == this.currentPage;
  }),
  hasMultiplePages: gt('lastPage', 0),
  startItem: computed('size', 'currentPage', function () {
    return this.size * (this.currentPage - 1) + 1;
  }),
  endItem: computed('startItem', 'nbOfItems', function () {
    return this.startItem + this.nbOfItems - 1;
  }),
  pageOptions: computed('firstPage', 'lastPage', function () {
    const nbOfPages = this.lastPage - this.firstPage + 1;
    return Array.from(
      new Array(nbOfPages),
      (val, index) => this.firstPage + index
    );
  }),
  actions: {
    changePage(link) {
      this.set('page', link['number'] || 0);
    },
  },
});
