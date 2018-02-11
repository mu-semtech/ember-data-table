import { set } from '@ember/object';
import { computed } from '@ember/object';
import Component from '@ember/component';
import layout from '../templates/components/data-table-content-body';

export default Component.extend({
  tagName: 'tbody',
  init() {
    this._super(...arguments);
    if( ! this['data-table'] )
      this.set('data-table', {});
    if( ! this['content'] )
      this.set('content', []);
  },
  layout,
  offset: computed('data-table.{page,size}', function(){
      var offset = 1; //to avoid having 0. row
      var page = this.get('data-table.page');
      var size = this.get('data-table.size');
      if (page && size) {
        offset += page * size;
      }
      return offset;
  }),
  wrappedItems: computed('content', 'content.[]', 'data-table.selection.[]', function() {
    const selection = this.get('data-table.selection') || [];
    const content = this.get('content') || [];
    return content.map(function(item) {
      return { item: item, isSelected: selection.includes(item) };
    });
  }),
  actions: {
    updateSelection(selectedWrapper, event) {
      set(selectedWrapper, 'isSelected', event.target.checked);
      this.get('wrappedItems').forEach((wrapper) => {
        if (wrapper.isSelected) {
          this.get('data-table').addItemToSelection(wrapper.item);
        } else {
          this.get('data-table').removeItemFromSelection(wrapper.item);
        }
      });
    }
  }
});
