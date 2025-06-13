import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { hash } from '@ember/helper';
import { action } from '@ember/object';
import { isEmpty , typeOf } from '@ember/utils';

import { or } from 'ember-truth-helpers';

import attributeToSortParams from '../utils/attribute-to-sort-params';
import get from '../utils/get';
import {
  definitionsToArray,
  toComponentSpecification,
} from '../utils/string-specification-helpers';
import DataTableDataTableContent from './data-table/content.gjs';
import DataTableDataTableMenu from './data-table/menu.gjs';
import DataTableNumberPagination from './data-table/number-pagination.gjs';
import DataTableTextSearch from './data-table/text-search.gjs';

const DEFAULT_DEBOUNCE_TIME = 2000;

export default class DataTable extends Component {
  <template>
    {{yield
      (hash
        Search=(component
          DataTableTextSearch
          filter=this.filter
          placeholder=this.searchPlaceholder
          autoSearch=this.autoSearch
          updateFilter=this.updateFilter
          searchDebounceTime=this.searchDebounceTime
        )
        Content=(component
          DataTableDataTableContent
          content=@content
          noDataMessage=this.noDataMessage
          enableSelection=@enableSelection
          selectionProperty=@selectionProperty
          enableLineNumbers=@enableLineNumbers
          onClickRow=@onClickRow
          sort=this.sort
          updateSort=this.updateSort
          customHeaders=this.customHeaders
          fields=this.fields
          links=@links
          linksModelProperty=this.linksModelProperty
          rowLink=@rowLink
          rowLinkModelProperty=this.rowLinkModelProperty
          dataTable=this
        )
        Pagination=(component
          DataTableNumberPagination
          page=this.page
          size=this.size
          itemsOnCurrentPage=@content.length
          sizeOptions=this.sizeOptions
          total=@total
          meta=(or @meta @content.meta)
          updatePage=this.updatePage
          updateSize=this.updatePageSize
          backendPageOffset=@backendPageOffset
        )
        Menu=(component
          DataTableDataTableMenu enableSelection=@enableSelection dataTable=this
        )
        content=@content
        enableSearch=this.enableSearch
        dataTable=this
      )
    }}
  </template>
  @tracked _selection = undefined;

  get filter() {
    return this.args.filter;
  }

  get sort() {
    return this.args.sort;
  }

  get selection() {
    if(this.args.selection !== undefined) {
      return this.args.selection;
    }

    if (
      this._selection === undefined &&
      this.args.initialSelection === undefined
    )
      return [];
    else if (this._selection !== undefined) return this._selection;
    else return this.args.initialSelection;
  }

  set selection(newSelection) {
    if (this.args.selection !== undefined) {
      const updater = this.args.updateSelection;

      if(!updater) {
        assert(
          `Could not update selection because @updateSelection was not supplied to data table, but @selection was.`,
        );
      } else {
        updater(newSelection);
      }
    } else {
      this._selection = newSelection;
    }

  }

  get noDataMessage() {
    return this.args.noDataMessage === undefined
      ? 'No data'
      : this.args.noDataMessage;
  }

  get isLoading() {
    return this.args.isLoading;
  }

  /**
   * Calculates the search debounce time.
   *
   * A shorthand form is supported in which the user supplies a
   * number to autoSearch in which case we use that.  This would not
   * work with 0 (which is a strange debounce time in itself) so this
   * option exists for now.
   */
  get searchDebounceTime() {
    return isNaN(this.args.autoSearch)
      ? DEFAULT_DEBOUNCE_TIME
      : this.args.autoSearch;
  }

  get enableSelection() {
    return this.args.enableSelection;
  }

  get selectionIsEmpty() {
    return this.selection.length === 0;
  }

  get page() {
    return this.args.page || 0;
  }

  get size() {
    return this.args.size || 5;
  }

  get sizeOptions() {
    const sizeOptions =
      this.args.sizes === undefined
        ? [5, 10, 25, 50, 100]
        : definitionsToArray(this.args.sizes).map((nrOrStr) =>
            parseInt(nrOrStr),
          );

    if (isEmpty(sizeOptions)) {
      return null;
    } else {
      if (!sizeOptions.includes(this.size) && this.size) {
        sizeOptions.push(this.size);
      }

      sizeOptions.sort((a, b) => a - b);

      return sizeOptions;
    }
  }

  get enableSearch() {
    return this.args.enableSearch === undefined
      ? this.filter !== undefined
      : this.args.enableSearch;
  }

  get autoSearch() {
    return this.args.autoSearch === undefined ? true : this.args.autoSearch;
  }

  get linksModelProperty() {
    return this.args.linksModelProperty === undefined
      ? 'id'
      : this.args.linksModelProperty;
  }

  get rowLinkModelProperty() {
    return this.args.rowLinkModelProperty === undefined
      ? 'id'
      : this.args.rowLinkModelProperty;
  }

  attributeToSortParams(attribute) {
    if (this.args.attributeToSortParams) {
      return this.args.attributeToSortParams(attribute);
    } else {
      return attributeToSortParams(attribute);
    }
  }

  get fields() {
    // this.args.fields can be:
    // - a string => split up to array, use component specification logic to get the meta object
    // - an array => map every value depending on its type:
    //        - if a string => use component specification logic
    //        - if an object => use the object as is, override `attribute` and `label` with component specification logic
    // this always passing all parameters to `@fields`
    const fields = definitionsToArray(this.args.fields);
    const fieldsWithMeta = fields.map((field) => {
      return {
        ...(typeOf(field) === 'string' ? {} : field),
        ...toComponentSpecification(field, [
          { raw: 'attribute' },
          { name: 'label', default: 'attribute' },
        ]),
      };
    });

    return fieldsWithMeta.map(
      ({
        attribute,
        label,
        sortParameters,
        isSortable,
        hasCustomHeader,
        isCustom,
        customFieldComponent,
        customHeaderComponent,
      }) => ({
        attribute,
        label,
        sortParameters:
          sortParameters || // custom format says it's sortable
          ((isSortable || // custom format says it's sortable
            this.sortableFields == null || // default: all fields are sortable
            this.sortableFields?.includes(attribute)) && // @sortableFields
            this.attributeToSortParams(attribute)),
        get isSortable() {
          return Object.keys(this.sortParameters || {}).length >= 1;
        },
        hasCustomHeader:
          hasCustomHeader || this.customHeaders.includes(attribute),
        isCustom: isCustom || this.customFields.includes(attribute),
        customFieldComponent:
          customFieldComponent || this.customFieldComponents[attribute] || null,
        customHeaderComponent:
          customHeaderComponent ||
          this.customHeaderComponents[attribute] ||
          null,
      }),
    );
  }

  get customHeaders() {
    const headers = this.args.customHeaders;

    if (typeOf(headers) === 'object') {
      return Object.keys(headers).filter((attr) => isEmpty(headers[attr]));
    } else {
      return definitionsToArray(headers);
    }
  }

  get customFields() {
    const fields = this.args.customFields;

    if (typeOf(fields) === 'object') {
      return Object.keys(fields).filter((attr) => isEmpty(fields[attr]));
    } else {
      return definitionsToArray(fields);
    }
  }

  get customFieldComponents() {
    const fields = this.args.customFields;

    return typeOf(fields) === 'object' ? fields : {};
  }

  get customHeaderComponents() {
    const headers = this.args.customHeaders;

    return typeOf(headers) === 'object' ? headers : {};
  }

  get sortableFields() {
    const sortableFields = this.args.sortableFields;

    if (sortableFields || sortableFields === '')
      return definitionsToArray(sortableFields);
    // default: all fields are sortable
    else return null;
  }

  get searchPlaceholder() {
    return this.args.searchPlaceholder === undefined
      ? 'Search input'
      : this.args.searchPlaceholder;
  }

  @action
  updatePageSize(size) {
    const updater = this.args.updatePageSize;

    if (!updater) {
      assert(
        `Could not update page size to ${size} because @updatePageSize was not supplied to data table`,
      );
    } else {
      this.updatePage(0);
      updater(size);
    }
  }

  @action
  updateFilter(filter) {
    const updater = this.args.updateFilter;

    if (!updater) {
      assert(
        `Could not update filter to '${filter}' because @updateFilter was not supplied to data table`,
      );
    } else {
      this.updatePage(0);
      updater(filter);
    }
  }

  @action
  updateSort(sort) {
    const updater = this.args.updateSort;

    if (!updater) {
      assert(
        `Could not update sorting to '${sort}' because @updateSort was not supplied to data table`,
      );
    } else {
      this.updatePage(0);
      updater(sort);
    }
  }

  @action
  updatePage(page) {
    const updater = this.args.updatePage;

    if (!updater) {
      console.error(
        `Could not update page to ${page} because @updatePage was not supplied to data table`,
      );
    } else {
      updater(page);
    }
  }

  @action
  addItemToSelection(item) {
    this.removeItemFromSelection(item); // in case the item was already selected
    this.selection = [...this.selection, item]; // create new array to trigger setter of `selection`
  }
  @action
  removeItemFromSelection(item) {
    const byPath = this.args.selectionProperty;

    this.selection = this.selection.filter(
      (x) => get(x, byPath) !== get(item, byPath),
    );
  }
  @action
  clearSelection() {
    this.selection = [];
  }
}
