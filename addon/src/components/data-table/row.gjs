import Component from '@glimmer/component';
import { fn, hash } from '@ember/helper';
import { action, get } from '@ember/object';
import { service } from '@ember/service';

import includesBy from '../../helpers/includes-by.js';
import DataTableDataCells from './data-cells.gjs';

/* Used in: data-table/content-body */
export default class DataTableRowComponent extends Component {
  <template>
    {{! @item and @index come from consumer's data-table.hbs implementation }}
    {{yield
      (hash
        item=@item
        enableLineNumbers=@enableLineNumbers
        lineNumber=(this.add @index @offset)
        enableSelection=@enableSelection
        isSelected=(includesBy @selection @item @selectionProperty)
        toggleSelected=(fn @toggleSelected @item)
        linkedRoutes=this.linkedRoutes
        rowLink=@rowLink
        rowLinkModel=this.rowLinkModel
        hasClickRowAction=@hasClickRowAction
        rowClicked=this.rowClicked
        fields=@fields
        DataCells=(component
          DataTableDataCells
          fields=@fields
          item=@item
          rowLink=@rowLink
          rowLinkModel=this.rowLinkModel
          rowClicked=this.rowClicked
          linkedRoutes=this.linkedRoutes
          dataTable=@dataTable
        )
      )
    }}
  </template>
  @service router;

  add = (a, b) => a + b;

  get linkedRoutes() {
    return this.args.linkedRoutes.map((linkedRoute) => {
      const model = this.args.item;

      return Object.assign(
        {
          model: linkedRoute.linksModelProperty
            ? get(model, linkedRoute.linksModelProperty)
            : model,
        },
        linkedRoute,
      );
    });
  }

  get rowLinkModel() {
    const { item, rowLinkModelProperty } = this.args;

    return rowLinkModelProperty ? get(item, rowLinkModelProperty) : item;
  }

  @action
  rowClicked() {
    if (this.args.onClickRow) {
      this.args.onClickRow(...arguments);
    } else if (this.args.rowLink) {
      this.router.transitionTo(this.args.rowLink, this.rowLinkModel);
    }
  }
}
