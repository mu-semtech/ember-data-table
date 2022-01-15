import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/data-table-menu-selected';

export default Component.extend({
  layout,
  init: function () {
    this._super(...arguments);
    this.set('data-table.enableSelection', true);
  },
  selectionCount: computed.reads('data-table.selection.length'),
  actions: {
    clearSelection() {
      this.get('data-table').clearSelection();
    },
  },
});
