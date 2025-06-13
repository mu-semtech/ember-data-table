import Component from '@glimmer/component';
import { hash } from '@ember/helper';

import { toComponentSpecifications } from '../../utils/string-specification-helpers';
import DataTableDataTableContentBody from './content-body.gjs';
import DataTableDataTableContentHeader from './content-header.gjs';

/* Used in: data-table.hbs */
export default class DataTableContentComponent extends Component {
  <template>
    {{yield
      (hash
        Header=(component
          DataTableDataTableContentHeader
          enableSelection=@enableSelection
          enableLineNumbers=@enableLineNumbers
          sort=@sort
          updateSort=@updateSort
          hasLinks=this.hasLinks
          customHeaders=@customHeaders
          dataTable=@dataTable
          fields=@fields
        )
        Body=(component
          DataTableDataTableContentBody
          content=@content
          enableSelection=@enableSelection
          selectionProperty=@selectionProperty
          enableLineNumbers=@enableLineNumbers
          noDataMessage=@noDataMessage
          onClickRow=@onClickRow
          linkedRoutes=this.linkedRoutes
          rowLink=@rowLink
          rowLinkModelProperty=@rowLinkModelProperty
          dataTable=@dataTable
          fields=@fields
        )
        dataTable=@dataTable
      )
    }}
  </template>
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
   * Can pass a space-separated string or an array.
   * The array can already contain an object with the transformed link
   *
   * Yields an array of objects to represent the linked routes.
   * [ { route: "products.show", label: "Show product", icon: "show-icon" } ]
   */
  get linkedRoutes() {
    return toComponentSpecifications(this.args.links || '', [
      { raw: 'route' },
      'label',
      'icon',
    ]).map((spec) => {
      spec.linksModelProperty = this.args.linksModelProperty;

      return spec;
    });
  }
}
