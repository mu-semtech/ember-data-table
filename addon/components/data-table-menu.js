import Ember from 'ember';
import layout from '../templates/components/data-table-menu';

export default Ember.Component.extend({
  layout,
  classNames: ['data-table-header'],
  classNameBindings: ['selectionIsEmpty::selected'],
  selectionIsEmpty: Ember.computed('selection', function() {
    return this.get('selection.length') === 0;
  }),
});
