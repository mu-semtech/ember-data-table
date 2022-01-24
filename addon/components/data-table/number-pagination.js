import { action } from '@ember/object';
import Component from '@glimmer/component';

export default class NumberPaginationComponent extends Component {
  get currentPage() {
    return this.args.page
      ? parseInt(this.args.page) + 1 // TODO: verify this needs to parse the page, if the default is a number input should be parsed as a number too
      : 1;
  }

  set currentPage(newPage) {
    this.args.updatePage( newPage - 1 );
  }

  get firstPage() {
    return this.args.links?.first?.number || 1;
  }

  get lastPage() {
    return this.args.links?.last?.number || 1;
  }

  get isFirstPage() {
    return this.firstPage == this.currentPage;
  }

  get isLastPage() {
    return this.lastPage == this.currentPage;
  }

  get hasMultiplePages() {
    return this.lastPage > 0; // TODO: is this right?  All numbers seem to default to 1.
  }

  get startItem() {
    return this.args.size * (this.currentPage - 1) + 1;
  }

  get endItem() {
    return this.startItem + this.args.nbOfItems - 1;
  }

  get pageOptions() {
    const nbOfPages = this.lastPage - this.firstPage + 1;
    return Array.from(
      new Array(nbOfPages),
      (_val, index) => this.firstPage + index
    );
  }

  @action
  updatePage(link) {
    this.args.updatePage( link?.number || 0 );
  }

  @action
  selectSizeOption(event) {
    this.args.updateSize(parseInt(event.target.value));
  }
}
