import Ember from 'ember';
import layout from '../templates/components/data-table';

export default Ember.Component.extend({
  layout: layout,
  noDataMessage: 'No data',
  selection: Ember.computed.filterBy('rows', 'isSelected', true)
});
