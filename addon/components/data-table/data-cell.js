import Component from '@glimmer/component';

export default class DataTableDataCellComponent extends Component {
  get isCustom() {
    return this.args.column.isCustom;
  }

  get hasCustomFields() {
    return this.args.fields.find( ({isCustom}) => isCustom) || false;
  }

  get renderCustomBlock() {
    return this.args.hasCustomBlock && ( this.isCustom || !this.hasCustomFields );
  }
}
