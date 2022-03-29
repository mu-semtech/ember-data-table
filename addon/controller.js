import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';

export default class ProductsController extends Controller {
  queryParams = ['size', 'page', 'filter', 'sort'];

  @tracked size = 10;
  @tracked page = 0;
  @tracked filter = '';
  @tracked sort = ''; // TODO: perhaps undefined would be a nicer default for consumers
  @tracked isLoadingModel = false;
}
