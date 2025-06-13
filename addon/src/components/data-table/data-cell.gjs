import Component from '@glimmer/component';
import { get,hash } from '@ember/helper';

/* Used in: data-table/data-cells */
export default class DataTableDataCellComponent extends Component {
  <template>
    {{yield
      (hash
        firstColumnField=@firstColumnField
        otherColumnFields=@otherColumnFields
        item=@item
        rowLink=@rowLink
        rowLinkModel=@rowLinkModel
        rowClicked=@rowClicked
        label=@column.label
        fields=@fields
        isCustom=this.isCustom
        hasCustomFields=this.hasCustomFields
        attribute=@column.attribute
        renderCustomBlock=this.renderCustomBlock
        value=(get @item @column.attribute)
      )
    }}
  </template>
  get isCustom() {
    return this.args.column.isCustom;
  }

  get hasCustomFields() {
    return this.args.fields.find(({ isCustom }) => isCustom) || false;
  }

  get renderCustomBlock() {
    return this.args.hasCustomBlock && this.isCustom;
  }
}
