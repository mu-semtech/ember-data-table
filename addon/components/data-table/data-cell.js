import Component from '@glimmer/component';

export default class DataTableDataCellComponent extends Component {
  get isCustom() {
    return this.args.customFields?.split(" ").includes(this.args.column);
  }

  get hasCustom() {
    return this.args.customFields;
  }
}
