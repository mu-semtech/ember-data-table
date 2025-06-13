import Component from '@glimmer/component';
import { hash } from '@ember/helper';

import and from 'ember-truth-helpers/helpers/and';
import or from 'ember-truth-helpers/helpers/or';

import DataTableRow from './row.gjs';

/* Used in: data-table/content */
export default class DataTableContentBodyComponent extends Component {
  <template>
    {{yield
      (hash
        isLoading=@dataTable.isLoading
        content=@content
        offset=this.offset
        enableLineNumbers=@enableLineNumbers
        hasClickRowAction=(and (or @onClickRow @rowLink) true)
        toggleSelected=this.updateSelection
        selection=@dataTable.selection
        enableSelection=@enableSelection
        linkedRoutes=@linkedRoutes
        rowLink=@rowLink
        rowLinkModelProperty=@rowLinkModelProperty
        noDataMessage=@noDataMessage
        fields=@fields
        Row=(component
          DataTableRow
          dataTable=@dataTable
          enableLineNumbers=@enableLineNumbers
          enableSelection=@enableSelection
          selectionProperty=@selectionProperty
          selection=@dataTable.selection
          offset=this.offset
          hasClickRowAction=(and (or @onClickRow @rowLink) true)
          onClickRow=@onClickRow
          linkedRoutes=@linkedRoutes
          rowLink=@rowLink
          rowLinkModelProperty=@rowLinkModelProperty
          fields=@fields
          toggleSelected=this.updateSelection
        )
      )
    }}
  </template>

  get offset() {
    var offset = 1; //to avoid having 0. row
    var page = this.args.dataTable.page; // TODO: pass on page directly?
    var size = this.args.dataTable.size; // TODO: pass on size directly?

    if (page && size) {
      offset += page * size;
    }

    return offset;
  }

  updateSelection = (item, event) => {
    if (event.target.checked) this.args.dataTable.addItemToSelection(item);
    else this.args.dataTable.removeItemFromSelection(item);
  }
}
