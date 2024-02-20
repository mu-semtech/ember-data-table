/* eslint-disable ember/no-mixins, ember/no-new-mixins */
import EmberObject from '@ember/object';
import SerializerMixin from 'ember-data-table/mixins/serializer';
import { module, test } from 'qunit';

module('Unit | Mixin | serializer', function () {
  // Replace this with your real tests.
  test('it works', function (assert) {
    let SerializerObject = EmberObject.extend(SerializerMixin);
    let subject = SerializerObject.create();
    assert.ok(subject);
  });
});
