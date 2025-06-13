import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import { action } from '@ember/object';

/* Used in: data-table/content-header */
export default class ThSortableComponent extends Component {
  <template>
    {{yield
      (hash
        label=@field.label
        attribute=@field.attribute
        isSortable=@field.isSortable
        isSorted=this.isSorted
        toggleSort=this.toggleSort
        nextSort=this.nextSort
        isAscending=this.isAscending
        isDescending=this.isDescending
        sortDirection=this.sortDirection
        renderCustomBlock=this.renderCustomBlock
        isCustom=this.isCustom
        hasCustomHeaders=this.hasCustomHeaders
      )
    }}
  </template>
  get sortParameters() {
    return this.args.field.sortParameters;
  }

  get sortDirection() {
    for (const key in this.sortParameters)
      if (this.args.sort == this.sortParameters[key]) return key;

    return '';
  }

  get isAscending() {
    return this.sortDirection === 'asc';
  }

  get isDescending() {
    return this.sortDirection === 'desc';
  }

  get isSorted() {
    return this.sortDirection !== '';
  }

  get renderCustomBlock() {
    return this.args.hasCustomBlock && this.isCustom;
  }

  get isCustom() {
    return this.args.field.hasCustomHeader;
  }

  get hasCustomHeaders() {
    return (
      this.args.fields.find(({ hasCustomHeader }) => hasCustomHeader) || false
    );
  }

  get availableSortOptions() {
    const options = [];

    Object.keys(this.sortParameters)
      .sort() // for asc and desc, asc first then desc, the rest also sorted for now
      .map((key) => options.push(key));
    options.push(''); // no sorting

    return options;
  }

  get nextSort() {
    // wrapping loop over availableSortOptions
    const opts = this.availableSortOptions;

    return opts[(opts.indexOf(this.sortDirection) + 1) % opts.length];
  }

  /**
   * Wraps around possible sorting directions.
   */
  @action
  toggleSort() {
    this.args.updateSort(this.sortParameters[this.nextSort]);
  }
}
