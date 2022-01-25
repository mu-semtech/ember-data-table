import Component from '@glimmer/component';

export default class DefaultDataTableContentBodyComponent extends Component {
  get allFields() {
    return this.args['data-table'].parsedFields; // TODO: pass directly?
  }

  get firstColumn() {
    const parsedFields = this.args['data-table'].parsedFields;
    if (parsedFields.length > 0) return parsedFields[0];
    else return null;
  }

  get otherColumns() {
    const parsedFields = this.args['data-table'].parsedFields;
    if (parsedFields.length > 0) {
      let [, ...fields] = parsedFields;
      return fields;
    } else {
      return [];
    }
  }
}
