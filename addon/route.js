import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Route from '@ember/routing/route';
import merge from 'lodash/merge';

export default class DataTableRoute extends Route {
  @service store;

  queryParams = {
    filter: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
  };

  mergeQueryOptions() {
    return {};
  }

  model(params) {
    const options = {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
    };
    // TODO: sending an empty filter param to backend returns []
    if (params.filter) {
      options['filter'] = params.filter;
    }
    merge(options, this.mergeQueryOptions(params));
    return this.store.query(this.modelName, options);
  }

  @action
  loading(transition) {
    let controller = this.controllerFor(this.routeName);
    controller.isLoadingModel = true;

    transition.promise.finally(function () {
      controller.isLoadingModel = false;
    });

    return true; // bubble the loading event
  }
}
