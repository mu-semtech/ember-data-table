import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class ThSortableComponent extends Component {
  get dasherizedField() {
    return this.args.field.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
      Inverses the sorting parameter
      E.g. inverseSorting('title') returns '-title'
           inverseSorting('-title') returns 'title'
  */
  _inverseSorting(sorting) {
    if (sorting.substring(0, 1) === '-') {
      return sorting.substring(1);
    } else {
      return '-' + sorting;
    }
  }

  get isSorted() {
    return (
      this.args.currentSorting === this.dasherizedField ||
      this.args.currentSorting === this._inverseSorting(this.dasherizedField)
    );
  }

  get order() {
    if (this.args.currentSorting === this.dasherizedField) {
      return 'asc';
    } else if (this.args.currentSorting === `-${this.dasherizedField}`) {
      return 'desc';
    } else {
      return '';
    }
  }

  /**
       Sets the current sorting parameter.
       Note: the current sorting parameter may contain another field than the given field.
       In case the given field is currently sorted ascending, change to descending.
       In case the given field is currently sorted descending, clean the sorting.
       Else, set the sorting to ascending on the given field.
    */
  @action
  inverseSorting() {
    if (this.order === 'asc') {
      this.args.updateSort(this._inverseSorting(this.args.currentSorting));
    } else if (this.order === 'desc') {
      this.args.updateSort("");
    } else {
      // if currentSorting is not set to this field
      this.args.updateSort(this.dasherizedField);
    }
  }
}
