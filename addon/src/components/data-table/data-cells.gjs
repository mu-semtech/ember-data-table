import Component from '@glimmer/component';
import { hash } from '@ember/helper';

import DataTableDataCell from './data-cell.gjs';

/* Used in: data-table/row */
export default class DataTableDataCellsComponent extends Component {
  <template>
    {{yield
      (hash
        firstColumnField=this.firstColumnField
        otherColumnFields=this.otherColumnFields
        item=@item
        rowLink=@rowLink
        rowLinkModel=@rowLinkModel
        rowClicked=@rowClicked
        fields=@fields
        DataCell=(component
          DataTableDataCell
          firstColumnField=this.firstColumnField
          otherColumnFields=this.otherColumnFields
          item=@item
          rowLink=@rowLink
          rowLinkModel=@rowLinkModel
          rowClicked=@rowClicked
          fields=@fields
        )
      )
    }}
  </template>
  get firstColumnField() {
    return this.args.fields?.[0] || null;
  }

  get otherColumnFields() {
    if (this.args.fields?.length) {
      let [, ...fields] = this.args.fields;

      return fields;
    } else {
      return [];
    }
  }
}
