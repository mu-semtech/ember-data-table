import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';

import { typeOf } from '@ember/utils';

export default class DataTable extends Component {
  @tracked _selection = undefined;

  get selection() {
    if (this._selection === undefined
        && !('selection' in this.args))
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
    return 'noDataMessage' in this.args
      ? this.args.noDataMessage
      : 'No data';
  }

  get isLoading() {
    return this.args.isLoading;
  }

  get enableLineNumbers() {
    return this.args.lineNumbers;
  }

  get searchDebounceTime() {
    return 'searchDebounceTime' in this.args
      ? this.args.searchDebounceTime
      : 2000;
  }

  get enableLineNumbers() {
    return this.args.enableLineNumbers;
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
    return 'enableSizes' in this.args
      ? this.args.enableSizes
      : true;
  }

  _size = undefined;
  get size() {
    if (this._size === undefined && this.args.size)
      return this.args.size;
    else if (this._size)
      return this._size;
    else
      return 5;
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
    return 'filter' in this.args;
  }

  get autoSearch() {
    return 'autoSearch' in this.args
      ? this.args.autoSearch
      : true;
  }

  // TODO: make sure onFilterChanged is called and pushes its values through
  onFilterChanged() {
    this.page = 0;
  }

  // TODO: make sure onSizeChanged is called and pushes its values through
  onSizeChanged() {
    this.page = 0;
  }

  get parsedFields() {
    const fields = this.fields;
    if (typeOf(fields) === 'string') {
      return fields.split(' ');
    } else {
      return fields || [];
    }
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
