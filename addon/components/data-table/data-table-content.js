import Component from '@glimmer/component';
import { toComponentSpecifications } from '../../utils/string-specification-helpers';

export default class DataTableContentComponent extends Component {
  get hasLinks() {
    return this.linkedRoutes.length > 0;
  }

  /**
   * Accepts and transforms definitions for linked routes.
   *
   * Implementations may transform this at will.  The default
   * transformation splits on `:` assuming the first part is the route
   * and the second part is the label.  If no label is given, it is
   * passed as null.  If a label is given, all underscores are
   * transformed to spaces and double underscores are left as a single
   * _.  We split again on a third `:`, transforming in the same way for
   * the suggested icon.
   *
   * Behaviour for `___` is undefined.
   *
   * Yields an array of objects to represent the linked routes.
   * [ { route: "products.show", label: "Show product", icon: "show-icon" } ]
   */
  get linkedRoutes() {
    return toComponentSpecifications(this.args.links || "", [{ raw: "route" }, "label", "icon"]);
  }
}
