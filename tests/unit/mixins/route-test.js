/* eslint-disable ember/no-classic-classes, ember/no-mixins, ember/no-new-mixins */

import EmberObject from '@ember/object';
import RouteMixin from 'ember-data-table/mixins/route';
import { module, test } from 'qunit';

module('Unit | Mixin | route', function () {
  test('it (deep) merges the response of mergeQueryOptions method with the query param options', function (assert) {
    assert.expect(2);

    let RouteObject = EmberObject.extend(RouteMixin, {
      modelName: 'test',
      mergeQueryOptions() {
        return {
          foo: 'bar',
          page: {
            size: 5,
          },
        };
      },
    });

    let mockStore = {
      query: (modelName, queryOptions) => {
        assert.strictEqual(modelName, 'test');
        assert.deepEqual(queryOptions, {
          sort: 'name',
          page: {
            size: 5,
            number: 0,
          },
          foo: 'bar',
        });
      },
    };

    let mockRoute = RouteObject.create();
    mockRoute.store = mockStore;
    mockRoute.model({ sort: 'name', page: 0, size: 20 });
  });
});
