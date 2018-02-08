import { oneWay } from '@ember/object/computed';
import { alias } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../templates/components/data-table-content-header';

export default Component.extend({
  layout,
  tagName: 'thead',
  sort: alias("data-table.sort"),
  fields: oneWay("data-table.parsedFields")
});
