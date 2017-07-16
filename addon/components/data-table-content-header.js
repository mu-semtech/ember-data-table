import Ember from 'ember';
import layout from '../templates/components/data-table-content-header';

export default Ember.Component.extend({
  layout,
  tagName: 'thead',
  sort: Ember.computed.alias("data-table.sort"),
  fields: Ember.computed.oneWay("data-table.parsedFields")
});
