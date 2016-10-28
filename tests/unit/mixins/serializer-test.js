import Ember from 'ember';
import SerializerMixin from 'ember-data-table/mixins/serializer';
import { module, test } from 'qunit';

module('Unit | Mixin | serializer');

// Replace this with your real tests.
test('it works', function(assert) {
  let SerializerObject = Ember.Object.extend(SerializerMixin);
  let subject = SerializerObject.create();
  assert.ok(subject);
});
