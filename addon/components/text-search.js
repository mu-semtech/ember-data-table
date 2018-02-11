import { oneWay } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../templates/components/text-search';

export default Component.extend({
  layout,
  filter: '',
  classNames: ["data-table-search"],
  internalValue: oneWay('filter'),
  wait: 2000,
  auto: true,
  placeholder: 'Search'
});
