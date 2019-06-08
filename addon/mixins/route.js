/*jshint unused:false */
import Mixin from '@ember/object/mixin';
import _ from 'lodash';

export default Mixin.create({
  queryParams: {
    filter: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true }
  },
  mergeQueryOptions() {
    return {};
  },
  model(params) {
    const options = {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size
      }
    };
    // TODO: sending an empty filter param to backend returns []
    if (params.filter) { options['filter'] = params.filter; }
     _.merge(options, this.mergeQueryOptions(params));
    return this.get('store').query(this.get('modelName'), options);
  },
  actions: {
    loading(transition) {
      let controller = this.controllerFor(this.routeName);
      controller.set('isLoadingModel', true);
      transition.promise.finally(function() {
        controller.set('isLoadingModel', false);
      });

      return true; // bubble the loading event
    }
  }
});
