import Ember from 'ember';
import layout from '../templates/components/data-table-menu';

export default Ember.Component.extend({
  layout,
  classNames: ['data-table-header'],
  classNameBindings: ['selectionIsEmpty::selected'],
  selectionIsEmpty: Ember.computed('data-table.selection.[]', function() {
    return this.get('data-table.selection.length') === 0;
  }),
});
