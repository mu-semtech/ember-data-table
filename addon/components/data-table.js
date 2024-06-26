import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { typeOf } from '@ember/utils';
import { toComponentSpecifications, splitDefinitions } from "../utils/string-specification-helpers";

export default class DataTable extends Component {
  @tracked _selection = undefined;

  get selection() {
    if (this._selection === undefined && this.args.selection === undefined)
      return [];
    else if (this._selection !== undefined) return this._selection;
    else return this.args.selection;
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
    return this.args.isLoading;
  }

  get searchDebounceTime() {
    return this.args.searchDebounceTime === undefined
      ? 2000
      : this.args.searchDebounceTime;
  }

  @tracked
  _enableSelection = undefined;

  get enableSelection() {
    return this._enableSelection === undefined
      ? this.args.hasMenu
      : this._enableSelection;
  }

  set enableSelection(value) {
    this._enableSelection = value;
  }

  get selectionIsEmpty() {
    return this.selection.length === 0;
  }

  get enableSizes() {
    return this.args.enableSizes === undefined ? true : this.args.enableSizes;
  }

  get sort() {
    return this.args.sort;
  }

  get page() {
    return this.args.page;
  }

  _size = undefined;
  get size() {
    if (this._size === undefined && this.args.size) return this.args.size;
    else if (this._size) return this._size;
    else return 5;
  }
  set size(newSize) {
    this._size = newSize;
  }

  get sizeOptions() {
    if (!this.enableSizes) {
      return null;
    } else {
      const sizeOptions = this.args.sizes || [5, 10, 25, 50, 100];
      if (!sizeOptions.includes(this.size)) {
        sizeOptions.push(this.size);
      }
      sizeOptions.sort((a, b) => a - b);
      return sizeOptions;
    }
  }

  @tracked hasMenu = false; // old comment: set from inner component, migth fail with nested if

  get enableSearch() {
    return this.args.filter !== undefined;
  }

  get autoSearch() {
    return this.args.autoSearch === undefined ? true : this.args.autoSearch;
  }

  get fieldsWithMeta() {
    const fields = this.args.fields;

    if (typeOf(fields) === 'string') {
      return toComponentSpecifications(fields, [{raw: "attribute"},{name: "label", default: "attribute"}]);
    } else {
      return fields || [];
    }
  }

  get fields() {
    return this
      .fieldsWithMeta
      .map( ({ attribute, label, isSortable, hasCustomHeader, isCustom }) => ({
        attribute,
        label,
        isSortable: isSortable
          || !this.sortableFields
          || this.sortableFields.includes(attribute),
        hasCustomHeader: hasCustomHeader
          || this.customHeaders.includes(attribute),
        isCustom: isCustom
          || this.customFields.includes(attribute)
      }) );
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

  get parsedFields() {
    console.warn("Use of parsedFields in dataTable is deprecated");
    return this.fieldsWithMeta.map(({attribute}) => attribute);
  }

  get searchPlaceholder() {
    return this.args.searchPlaceholder === undefined
      ? 'Search input'
      : this.args.searchPlaceholder;
  }

  @action
  updatePageSize(size) {
    this.args.updatePage(0);
    this.args.updatePageSize(size);
  }

  @action
  updateFilter(filter) {
    this.args.updatePage(0);
    this.args.updateFilter(filter);
  }

  @action
  updateSort(sort) {
    this.args.updatePage(0);
    this.args.updateSort(sort);
  }

  addItemToSelection(item) {
    this.selection = [item, ...this.selection];
  }
  removeItemFromSelection(item) {
    this.selection = this.selection.filter((x) => x !== item);
  }
  clearSelection() {
    this.selection = [];
  }
}
