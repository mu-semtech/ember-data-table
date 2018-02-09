import EmberObject from '@ember/object';
import RouteMixin from 'ember-data-table/mixins/route';
import { module, test } from 'qunit';

module('Unit | Mixin | route');

// Replace this with your real tests.
test('it works', function(assert) {
  let RouteObject = EmberObject.extend(RouteMixin);
  let subject = RouteObject.create();
  assert.ok(subject);
});
