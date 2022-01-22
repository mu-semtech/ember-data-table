import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class DataTableMenuSelectedComponent extends Component {
  constructor() {
    super(...arguments);
    this.args["data-table"].enableSelection = true; // TODO: is this the best way to handle such case?
  }

  get selectionCount() {
    return this.args["data-table"].selection.length;
  }

  @action
  clearSelection() {
    this.args["data-table"].clearSelection();
  }
}
