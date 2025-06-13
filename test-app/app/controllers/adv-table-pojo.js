import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';

export default class AdvTablePojoController extends Controller {
  queryParams = ['size', 'page', 'filter', 'sort'];

  @tracked size = 10;
  @tracked page = 0;
  @tracked filter = '';
  @tracked sort = '';
  @tracked isLoadingModel = false;
}