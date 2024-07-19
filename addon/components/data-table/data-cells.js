import Component from '@glimmer/component';

export default class DataTableDataCellsComponent extends Component {
  get firstColumn() {
    return this.args.fields?.[0] || null;
  }

  get otherColumns() {
    if (this.args.fields?.length) {
      let [, ...fields] = this.args.fields;
      return fields;
    } else {
      return [];
    }
  }
}
