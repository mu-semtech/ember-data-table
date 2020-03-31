import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import layout from '../templates/components/data-table-content';

export default Component.extend({
  layout,
  classNames: ["data-table-content"],
  tableClass: alias("data-table.tableClass"),
});
