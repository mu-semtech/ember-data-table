import Ember from 'ember';
import FieldSortingMixin from 'ember-data-table/mixins/field-sorting';
import { module, test } from 'qunit';

module('Unit | Mixin | field sorting');

// Replace this with your real tests.
test('it works', function(assert) {
  let FieldSortingObject = Ember.Object.extend(FieldSortingMixin);
  let subject = FieldSortingObject.create();
  assert.ok(subject);
});
