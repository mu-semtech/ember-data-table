import { get } from '@ember/object';
import Component from '@glimmer/component';

export default class DataTableRowComponent extends Component {
  get linkedRoutes() {
    return this.args.linkedRoutes.map( (linkedRoute) => {
      const model = this.args.wrapper.item;
      return Object.assign( {
        model: linkedRoute.linksModelProperty
          ? get(model, linkedRoute.linksModelProperty)
          : model
      }, linkedRoute );
    } );
  }
}
