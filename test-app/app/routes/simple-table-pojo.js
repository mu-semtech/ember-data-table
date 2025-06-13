import { action } from '@ember/object';
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class SimpleTablePojoRoute extends Route {
  @service createData;

  queryParams = {
    filter: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
  };

  model(params) {
    const query = {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
    };

    if (params.filter) {
      query['filter'] = params.filter;
    }

    return this.createData.queryPeople(query);
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
