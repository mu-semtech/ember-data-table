import Ember from 'ember';
import layout from '../templates/components/th-sortable';
import FieldSorting from 'ember-data-table/mixins/field-sorting';

export default Ember.Component.extend( FieldSorting, {
  layout: layout,
  tagName: 'th',
  sort: Ember.computed.alias('current')
});
