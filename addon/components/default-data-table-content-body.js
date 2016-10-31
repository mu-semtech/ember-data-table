import Ember from 'ember';
import layout from '../templates/components/default-data-table-content-body';

export default Ember.Component.extend({
  layout,
  tagName: '',
  allFields: Ember.computed.oneWay('data-table.parsedFields'),
  firstColumn: Ember.computed( 'data-table.parsedFields', function(){
    return this.get('data-table.parsedFields.firstObject');
  }),
  otherColumns: Ember.computed( 'data-table.parsedFields', function(){
    const fields = this.get('data-table.parsedFields');
    return fields.splice(1);
  }),
  linkedRoute: Ember.computed.oneWay( 'data-table.link' ),
});
