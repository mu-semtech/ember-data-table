import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class DataTableContentBodyComponent extends Component {
  @service router

  get offset() {
    var offset = 1; //to avoid having 0. row
    var page = this.args.dataTable.page; // TODO: pass on page directly?
    var size = this.args.dataTable.size; // TODO: pass on size directly?
    if (page && size) {
      offset += page * size;
    }
    return offset;
  }

  get wrappedItems() {
    const selection = this.args.dataTable.selection || []; // TODO: should the dataTable ensure this is an array?
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
        this.args.dataTable.addItemToSelection(wrapper.item); // TODO: pass on addItemToSelection directly?
      } else {
        this.args.dataTable.removeItemFromSelection(wrapper.item); // TODO: pass on removeItemFromSelection directly?
      }
    });
  }

  @action
  onClickRow() {
    if (this.args.onClickRow)
      this.args.onClickRow(...arguments);
    else if ( this.args.rowLink )
      this.router.transitionTo( this.args.rowLink, arguments[0] );
  }
}
