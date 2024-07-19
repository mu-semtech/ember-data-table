import { action } from '@ember/object';
import Component from '@glimmer/component';

const humanPageOffset = 1; // humans assume the first page has number 1

/**
 * Converts from the human based page number (eg: first = 1) to the
 * backend-based offset.
 */
function humanToBackend(number, backendPageOffset) {
  return number - humanPageOffset + backendPageOffset;
}

/**
 * Converts from a backend page number to (eg: often first = 0) to the
 * human-based offset (eg: first = 1)
 */
function backendToHuman(number, backendPageOffset) {
  return number + humanPageOffset - backendPageOffset;
}

/**
 * Converts a human-based number to a zero-based number.
 */
function humanToZeroBased(number) {
  return number - humanPageOffset;
}

/**
 * Converts a zero-based number to a human-based number.
 */
function zeroToHumanBased(number) {
  return number + humanPageOffset;
}

/**
 * Helpers for pagination buttons.
 *
 * This component does not assume a backend offset.  If the backend's
 * first page has a number, we will assume that is the offset for the
 * first page.  This component then uses the numbers as a user would see
 * them, as that's likely the easiest to construct the template.
 *
 * The inputs to this component from its wrapping component are what the
 * backend understands in terms of page numbers, the outputs to the
 * yielded block are what humans would understand.
 */
export default class NumberPaginationComponent extends Component {
  get currentBackendPage() {
    return this.args.page
      ? parseInt(this.args.page)
      : this.backendPageOffset;
  }

  /**
   * Yields 0 for 0-based offset from the backend, and 1 for 1-based
   * offset.  Also works for n-based offset but no one does that, we
   * hope.
   */
  get backendPageOffset() {
    if( this.args.backendPageOffset !== undefined ) {
      // users may supply this
      return this.args.backendPageOffset;
    } else if( this.args.meta?.links?.first?.number !== undefined ) {
      // or we could derive from the backend
      return this.args.meta.links.first.number;
    } else {
      // and else it's just 0
      return 0;
    }
  }

  /**
   * The human page is as the user would view the page, what we supply
   * as functions and parameters outside of this component is based on
   * what the API supplies.
   */
  get humanPage() {
    return backendToHuman(this.args.page || this.backendPageOffset, this.backendPageOffset);
  }
  set humanPage(number) {
    this.updatePage(humanToBackend(number || 0, this.backendPageOffset));
  }
  @action
  updateHumanPage(number) {
    this.humanPage = number;
  }

  get firstPage() {
    return humanPageOffset;
  }

  get lastPage() {
    const backendLastPageNumber = Math.floor(this.total / this.args.size);
    return backendToHuman(backendLastPageNumber, this.backendPageOffset);
  }

  get previousPage() {
    return this.isFirstPage
      ? undefined
      : this.humanPage - 1;
  }

  get nextPage() {
    return this.isLastPage
      ? undefined
      : this.humanPage + 1;
  }

  get isFirstPage() {
    return this.humanPage == this.firstPage;
  }

  get isLastPage() {
    return this.humanPage == this.lastPage;
  }

  get hasMultiplePages() {
    return this.lastPage > this.firstPage;
  }

  get startItem() {
    // note, you might want to use this.args.page instead, but given
    // that comes from the backend, it's *not* guaranteed to be
    // zero-based either.
    if( this.args.itemsOnCurrentPage == 0 && this.isFirstPage )
      // human probably expects to see 0-0 when no items exist.
      return 0;
    else
      return zeroToHumanBased(this.args.size * humanToZeroBased( this.humanPage ));
  }

  get endItem() {
    // this one is exactly the same number as humanPageOffset yet it has
    // a different meaning.  When summing up lists, it's effectively
    // removing one regardless of the offset.
    if( this.args.itemsOnCurrentPage == 0 && this.isFirstPage )
      // human probably expects to see 0-0 when no items exist.
      return 0;
    else
      return this.startItem - 1 + this.args.itemsOnCurrentPage;
  }

  /**
   * Supplies an array with all available pages.
   */
  get pageOptions() {
    const nbOfPages = 1 + this.lastPage - this.firstPage;

    return Array.from(
      new Array(nbOfPages),
      (_val, index) => this.firstPage + index
    );
  }

  get total() {
    if( this.args.total !== undefined )
      return this.args.total;
    else if( this.args.meta?.count !== undefined )
      return this.args.meta.count;
    else
      return undefined;
  }

  get hasTotal() {
    return this.total || this.total === 0;
  }

  @action
  updatePage(number) {
    this.args.updatePage(number || this.backendPageOffset);
  }

  @action
  selectSizeOption(event) {
    this.args.updateSize(parseInt(event.target.value));
  }

  @action
  setSizeOption(size) {
    this.args.updateSize(parseInt(size));
  }
}
