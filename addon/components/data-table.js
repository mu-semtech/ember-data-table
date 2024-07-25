import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { typeOf } from '@ember/utils';
import { toComponentSpecifications, splitDefinitions } from "../utils/string-specification-helpers";
import attributeToSortParams from "../utils/attribute-to-sort-params";

export default class DataTable extends Component {
  @tracked _selection = undefined;

  get filter() {
    return this.args.filter !== undefined
      ? this.args.filter
      : this.args.view?.filter;
  }

  get sort() {
    return this.args.sort !== undefined
      ? this.args.sort
      : this.args.view?.sort;
  }

  get selection() {
    if (this._selection === undefined && this.args.selection === undefined)
      return [];
    else if (this._selection !== undefined)
      return this._selection;
    else
      return this.args.selection;
  }

  set selection(newSelection) {
    this._selection = newSelection; // also trigers dependent properties
  }

  get noDataMessage() {
    return this.args.noDataMessage === undefined
      ? 'No data'
      : this.args.noDataMessage;
  }

  get isLoading() {
    return this.args.isLoading !== undefined
      ? this.args.isLoading
      : this.args.view?.isLoading;
  }

  /**
   * Calculates the search debounce time.
   *
   * If the user supplies searchDebounceTime, that is what we should
   * use.  A shorthand form is supported in which the user supplies a
   * number to autoSearch in which case we use that.  This would not
   * work with 0 (which is a strange debounce time in itself) so this
   * option exists for now.
   */
  get searchDebounceTime() {
    return this.args.searchDebounceTime === undefined
      ? isNaN(this.args.autoSearch) ? 2000 : this.args.autoSearch
      : this.args.searchDebounceTime;
  }

  get enableSelection() {
    return this.args.enableSelection;
  }

  get selectionIsEmpty() {
    return this.selection.length === 0;
  }

  get enableSizes() {
    return this.args.enableSizes === undefined ? true : this.args.enableSizes;
  }

  get page() {
    const page = this.args.page !== undefined
          ? this.args.page
          : this.args.view?.page;
    return page || 0;
  }

  get size() {
    if ( this.args.size )
      return this.args.size;
    else if ( this.args.view?.size )
      return this.args.view.size;
    else
      return 5;
  }

  get sizeOptions() {
    if (!this.enableSizes) {
      return null;
    } else {
      const sizeOptions = this.args.sizes || [5, 10, 25, 50, 100];
      if (!sizeOptions.includes(this.size) && this.size) {
        sizeOptions.push(this.size);
      }
      sizeOptions.sort((a, b) => a - b);
      return sizeOptions;
    }
  }

  get enableSearch() {
    return this.filter !== undefined;
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

  get fieldsWithMeta() {
    const fields = this.args.fields;

    if (typeOf(fields) === 'string') {
      return toComponentSpecifications(fields, [{raw: "attribute"},{name: "label", default: "attribute"}]);
    } else {
      return fields || [];
    }
  }

  attributeToSortParams(attribute) {
    if( this.args.attributeToSortParams ) {
      return this.args.attributeToSortParams(attribute);
    } else {
      return attributeToSortParams(attribute);
    }
  }

  get fields() {
    return this
      .fieldsWithMeta
      .map( ({ attribute, label, isSortable, hasCustomHeader, isCustom, sortParameters }) => ({
        attribute,
        label,
        // custom format says it's sortable: sort params known
        // say it should be sortable: use attribute to sort param
        // field included in sortable fields: use attribute to sort param
        sortParameters: sortParameters
          || ( ( isSortable || this.sortableFields?.includes(attribute) )
               && this.attributeToSortParams(attribute) ),
        get isSortable() { return Object.keys( this.sortParameters || {} ).length > 1; },
        hasCustomHeader: hasCustomHeader
          || this.customHeaders.includes(attribute),
        isCustom: isCustom
          || this.customFields.includes(attribute)
      }));
  }

  get customHeaders() {
    return splitDefinitions(this.args.customHeaders);
  }

  get customFields() {
    return splitDefinitions(this.args.customFields);
  }

  get sortableFields() {
    const sortableFields = this.args.sortableFields;
    if (sortableFields || sortableFields === "")
      // default: all fields are sortable
      return splitDefinitions(sortableFields);
    else
      return null;
  }

  get searchPlaceholder() {
    return this.args.searchPlaceholder === undefined
      ? 'Search input'
      : this.args.searchPlaceholder;
  }

  @action
  updatePageSize(size) {
    const updater = this.args.updatePageSize !== undefined
          ? this.args.updatePageSize
          : this.args.view?.updatePageSize;

    if( !updater ) {
      console.error(`Could not update page size to ${size} because @updatePageSize was not supplied to data table`);
    } else {
      this.updatePage(0);
      updater(size);
    }
  }

  @action
  updateFilter(filter) {
    const updater = this.args.updateFilter || this.args.view?.updateFilter;

    if( !updater ) {
      console.error(`Could not update filter to '${filter}' because @updateFilter was not supplied to data table`);
    } else {
      this.updatePage(0);
      updater(filter);
    }
  }

  @action
  updateSort(sort) {
    const updater = this.args.updateSort !== undefined
          ? this.args.updateSort
          : this.args.view?.updateSort;

    if( !updater ) {
      console.error(`Could not update sorting to '${sort}' because @updateSort was not supplied to data table`);
    } else {
      this.updatePage(0);
      updater(sort);
    }
  }

  @action
  updatePage(page) {
    const updater = this.args.updatePage !== undefined
          ? this.args.updatePage
          : this.args.view?.updatePage;

    if( !updater ) {
      console.error(`Could not update page to ${page} because @updatePage was not supplied to data table`);
    } else {
      updater(page);
    }
  }

  @action
  addItemToSelection(item) {
    this.selection = [...new Set([item, ...this.selection])];
  }
  @action
  removeItemFromSelection(item) {
    this.selection = this.selection.filter((x) => x !== item);
  }
  @action
  clearSelection() {
    this.selection = [];
  }
}
