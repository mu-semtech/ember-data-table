import { module, test } from 'qunit';

import {
  deUnderscoreString,
  splitDefinitions,
  toComponentSpecification
} from 'ember-data-table/utils/string-specification-helpers';

module('Unit | Utils | string-specification-helpers', function () {
  test('it strips underscores', function (assert) {
    const checks = [
      ['one', 'one'],
      ['one_two', 'one two'],
      ['one_two_three', 'one two three'],
      ['one__two', 'one_two'],
      ['one__two_three', 'one_two three'],
      ['__hello__', '_hello_'],
    ];

    checks.forEach(([input, output]) => {
      assert.strictEqual(deUnderscoreString(input), output);
    });
  });

  test('it splits definitions', function (assert) {
    assert.deepEqual(splitDefinitions('hello world'), ['hello', 'world']);
    assert.deepEqual(splitDefinitions(null), []);
    assert.deepEqual(splitDefinitions(undefined), []);
  });

  test('it creates definition objects', function (assert) {
    function convertDefinition(string) {
      return toComponentSpecification(string || '', [
        { raw: 'route' },
        'label',
        'icon',
      ]);
    }

    const checks = [
      [
        { route: 'hello' },
        {
          route: 'hello',
          label: null,
          icon: null,
          rawLabel: null,
          rawIcon: null,
        },
      ],
      [
        'hello',
        {
          route: 'hello',
          label: null,
          icon: null,
          rawLabel: null,
          rawIcon: null,
        },
      ],
      [
        { route: 'hello.world', label: 'Hello World' },
        {
          route: 'hello.world',
          label: 'Hello World',
          icon: null,
          rawLabel: 'Hello World',
          rawIcon: null,
        },
      ],
      [
        'hello.world:Hello_World',
        {
          route: 'hello.world',
          label: 'Hello World',
          icon: null,
          rawLabel: 'Hello_World',
          rawIcon: null,
        },
      ],
      [
        'hello.world:Hello_World:add-icon-thing',
        {
          route: 'hello.world',
          label: 'Hello World',
          icon: 'add-icon-thing',
          rawLabel: 'Hello_World',
          rawIcon: 'add-icon-thing',
        },
      ],
      [
        { route: 'hello.world', label: 'Hello World', icon: 'add-icon-thing' },
        {
          route: 'hello.world',
          label: 'Hello World',
          icon: 'add-icon-thing',
          rawLabel: 'Hello World',
          rawIcon: 'add-icon-thing',
        },
      ],
    ];

    checks.forEach(([input, output]) =>
      assert.deepEqual(convertDefinition(input), output),
    );
  });
});
