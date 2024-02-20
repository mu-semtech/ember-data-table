/* eslint-disable ember/no-actions-hash, ember/no-classic-classes, ember/no-classic-components, ember/no-get, ember/require-tagless-components */
import { reads } from '@ember/object/computed';
import Component from '@ember/component';
import layout from '../templates/components/data-table-menu-selected';

export default Component.extend({
  layout,
  init: function () {
    this._super(...arguments);
    this.set('data-table.enableSelection', true);
  },
  selectionCount: reads('data-table.selection.length'),
  actions: {
    clearSelection() {
      this.get('data-table').clearSelection();
    },
  },
});
