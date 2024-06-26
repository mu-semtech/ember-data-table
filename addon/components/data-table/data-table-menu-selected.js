import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class DataTableMenuSelectedComponent extends Component {
  constructor() {
    super(...arguments);
    this.args.dataTable.enableSelection = true; // TODO: is this the best way to handle such case?
  }

  get selectionCount() {
    return this.args.dataTable.selection.length;
  }

  @action
  clearSelection() {
    this.args.dataTable.clearSelection();
  }
}
