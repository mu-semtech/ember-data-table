import { computed } from '@ember/object';
import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../templates/components/default-data-table-content-body';

export default Component.extend({
  layout,
  tagName: '',
  allFields: oneWay('data-table.parsedFields'),
  firstColumn: computed( 'data-table.parsedFields', function(){
    return this.get('data-table.parsedFields')[0];
  }),
  otherColumns: computed( 'data-table.parsedFields', function(){
    var fields;
    [, ...fields] = this.get('data-table.parsedFields');
    return fields;
  }),
  linkedRoute: oneWay( 'data-table.link' ),
});
