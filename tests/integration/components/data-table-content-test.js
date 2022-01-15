import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | data table content', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{data-table-content}}`);
    assert
      .dom('table.data-table')
      .exists({ count: 1 }, 'displays 1 data table');

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#data-table-content}}
        template block text
      {{/data-table-content}}
    `);

    assert.dom('*').hasText('template block text');
  });
});
