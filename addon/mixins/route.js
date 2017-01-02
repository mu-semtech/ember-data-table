/*jshint unused:false */
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
  mergeQueryOptions(params) {
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
    Ember.deprecate('mergedQueryOptions is deprecated. Please overwrite the mergeQueryOptions(params) functions of the ember-data-table route mixin to add custom query options', Object.keys(this.get('mergedQueryOptions')).length === 0, { id: 'mixin.route.mergedQueryOptions', until: 'v1.0.0'});
    $.extend(options, this.get('mergedQueryOptions'));
    $.extend(options, this.mergeQueryOptions(params));
    return this.store.query(this.get('modelName'), options);
  }
});
