import Ember from 'ember';
import $ from 'jquery';

export default Ember.Mixin.create({
  queryParams: {
    filter: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true }
  },
  mergedQueryOptions: {},
  model(params) {
    const options = {
      filter: params.filter,
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size
      }
    };
    $.extend(options, this.get('mergedQueryOptions'));
    return this.store.query(this.get('modelName'), options);
  }
});
