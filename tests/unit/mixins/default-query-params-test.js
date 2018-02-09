import EmberObject from '@ember/object';
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';
import { module, test } from 'qunit';

module('Unit | Mixin | default query params');

// Replace this with your real tests.
test('it works', function(assert) {
  let DefaultQueryParamsObject = EmberObject.extend(DefaultQueryParamsMixin);
  let subject = DefaultQueryParamsObject.create();
  assert.ok(subject);
});
