import Component from '@glimmer/component';
import { hash } from '@ember/helper';

/* Used in: data-table/menu */
export default class DataTableMenuSelectedComponent extends Component {
  <template>
    {{yield
      (hash
        selectionIsEmpty=@dataTable.selectionIsEmpty
        selectionCount=@dataTable.selection.length
        clearSelection=@dataTable.clearSelection
        selection=this.copiedSelection
        dataTable=@dataTable
      )
    }}

    {{! TODO: must we pass the data table itself?  It is shared with the consumers. }}
  </template>
  get selectionCount() {
    return this.args.dataTable.selection.length;
  }

  get copiedSelection() {
    return [...this.args.dataTable.selection];
  }
}
