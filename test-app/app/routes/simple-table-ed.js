import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AdvTableEdRoute extends Route {
  @service store;
  modelName = 'person';

  queryParams = {
    filter: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
  };

  model(params) {
    const options = {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
    };

    if (params.filter) {
      options['filter'] = params.filter;
    }

    return this.store.query(this.modelName, options);
  }

  @action
  loading(transition) {
    // eslint-disable-next-line ember/no-controller-access-in-routes
    let controller = this.controllerFor(this.routeName);

    if (controller) {
      controller.isLoadingModel = true;

      transition.finally(function () {
        controller.isLoadingModel = false;
      });
    }

    return true; // bubble the loading event
  }
}
