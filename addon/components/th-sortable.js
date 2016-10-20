import Ember from 'ember';
import layout from '../templates/components/th-sortable';
import FieldSorting from 'ember-data-table/mixins/field-sorting';

export default Ember.Component.extend( FieldSorting, {
  layout: layout,
  tagName: 'th',
  dasherizedField: Ember.computed('field', function() {
    return this.get('field').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  })
});
