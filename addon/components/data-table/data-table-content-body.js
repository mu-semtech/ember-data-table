import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class DataTableContentBodyComponent extends Component {
  get offset() {
    var offset = 1; //to avoid having 0. row
    var page = this.args['data-table'].page; // TODO: pass on page directly?
    var size = this.args['data-table'].size; // TODO: pass on size directly?
    if (page && size) {
      offset += page * size;
    }
    return offset;
  }

  get wrappedItems() {
    const selection = this.args['data-table'].selection || []; // TODO: should the data-table ensure this is an array?
    const content = this.args.content;
    return content.map(function (item) {
      return { item: item, isSelected: selection.includes(item) };
    });
  }

  @action
  updateSelection(selectedWrapper, event) {
    selectedWrapper.isSelected = event.target.checked;

    this.wrappedItems.forEach((wrapper) => {
      if (wrapper.isSelected) {
        this.args['data-table'].addItemToSelection(wrapper.item); // TODO: pass on addItemToSelection directly?
      } else {
        this.arg['data-table'].removeItemFromSelection(wrapper.item); // TODO: pass on removeItemFromSelection directly?
      }
    });
  }

  @action
  onClickRow() {
    if (this.args.onClickRow) this.args.onClickRow(...arguments);
  }
}
