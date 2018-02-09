import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/th-sortable';

export default Component.extend({
  layout: layout,
  tagName: 'th',
  classNames: ['sortable'],
  classNameBindings: ['isSorted:sorted'],
  dasherizedField: computed('field', function() {
    return this.get('field').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }),
  /**
      Inverses the sorting parameter
      E.g. inverseSorting('title') returns '-title'
           inverseSorting('-title') returns 'title'
  */
  _inverseSorting(sorting) {
    if (sorting.substring(0, 1) === '-') {
      return sorting.substring(1);
    } else {
      return "-" + sorting;
    }
  },
  isSorted: computed('dasherizedField', 'currentSorting', function() {
    return this.get('currentSorting') === this.get('dasherizedField') ||
      this.get('currentSorting') === this._inverseSorting(this.get('dasherizedField'));
  }),
  order: computed('dasherizedField', 'currentSorting', function() {
    if (this.get('currentSorting') === this.get('dasherizedField')) { return 'asc'; }
    else if (this.get('currentSorting') === `-${this.get('dasherizedField')}`) { return 'desc'; }
    else { return ''; }
  }),

  actions: {
    /**
       Sets the current sorting parameter.
       Note: the current sorting parameter may contain another field than the given field.
       In case the given field is currently sorted ascending, change to descending.
       In case the given field is currently sorted descending, clean the sorting.
       Else, set the sorting to ascending on the given field.
     */
    inverseSorting() {
      if (this.get('order') === 'asc') {
        this.set('currentSorting', this._inverseSorting(this.get('currentSorting')));
      } else if (this.get('order') === 'desc') {
        this.set('currentSorting', '');
      } else { // if currentSorting is not set to this field
        this.set('currentSorting', this.get('dasherizedField'));
      }
    }
  }

});
