import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class DataTableMenuSelectedComponent extends Component {
  get selectionCount() {
    return this.args.dataTable.selection.length;
  }

  get copiedSelection() {
    return [...this.args.dataTable.selection];
  }
}
