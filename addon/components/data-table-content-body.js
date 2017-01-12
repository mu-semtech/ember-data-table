import Ember from 'ember';
import layout from '../templates/components/data-table-content-body';

export default Ember.Component.extend({
  layout,
  tagName: 'tbody',
  offset: Ember.computed(function(){
      var offset = 1; //to avoid having 0. row
      if(this.get('data-table.hasPagination')) { //calculate the offset if we have pagination
        offset += this.get('data-table.page') * this.get('content.meta.pagination.first.size');
      }
      return offset;
  }),
  wrappedItems: Ember.computed('content', 'data-table.selection.[]', function() {
    const selection = this.get('data-table.selection');
    return this.get('content').map(function(item) {
      return { item: item, isSelected: selection.includes(item) };
    });
  }),
  actions: {
    updateSelection() {
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
