import Ember from 'ember';
import layout from '../templates/components/data-table-content-body';

export default Ember.Component.extend({
  layout,
  tagName: 'tbody',
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
