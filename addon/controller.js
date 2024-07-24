import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';

export default class DataTableController extends Controller {
  queryParams = ['size', 'page', 'filter', 'sort'];

  @tracked size = 10;
  @tracked page = 0;
  @tracked filter = '';
  @tracked sort = ''; // TODO: perhaps undefined would be a nicer default for consumers
  @tracked isLoadingModel = false;

  get view() {
    return {
      size: this.size,
      page: this.page,
      filter: this.filter,
      sort: this.sort,
      isLoading: this.isLoadingModel,
      updatePage: (page) => this.page = page,
      updatePageSize: (size) => this.size = size,
      updateFilter: (filter) => this.filter = filter,
      updateSort: (sort) => this.sort = sort
    }
  }
}
