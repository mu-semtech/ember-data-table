import { module, test } from 'qunit';
import { deUnderscoreString, splitDefinitions, toComponentSpecifications } from 'ember-data-table/utils/string-specification-helpers';

function convertDefinition(string) {
  return toComponentSpecifications(string || "", [{ raw: "route" }, "label", "icon"]);
}

module('Unit | Component | data-table-content', function() {
  test('it strips underscores', (assert) => {
    const checks = [["one", "one"],
    ["one_two", "one two"],
    ["one_two_three", "one two three"],
    ["one__two", "one_two"],
    ["one__two_three", "one_two three"],
    ["__hello__", "_hello_"]];

    assert.expect(checks.length);

    checks.forEach(([input, output]) => {
      assert.strictEqual(deUnderscoreString(input), output);
    });
  });

  test('it splits definitions', function(assert) {
    assert.deepEqual(splitDefinitions("hello world"), ["hello", "world"]);
    assert.deepEqual(splitDefinitions(null), []);
    assert.deepEqual(splitDefinitions(undefined), []);
  });

  test('it creates definition objects', function(assert) {
    const checks = [
      ["hello", {
        route: "hello",
        label: null,
        icon: null,
        rawLabel: null,
        rawIcon: null
      }],
      ["hello.world:Hello_World", {
        route: "hello.world",
        label: "Hello World",
        icon: null,
        rawLabel: "Hello_World",
        rawIcon: null
      }],
      ["hello.world:Hello_World:add-icon-thing", {
        route: "hello.world",
        label: "Hello World",
        icon: "add-icon-thing",
        rawLabel: "Hello_World",
        rawIcon: "add-icon-thing"
      }]];

    assert.expect(checks.length);

    checks.forEach(([input, output]) => assert.deepEqual(convertDefinition(input), output));
  });
});
