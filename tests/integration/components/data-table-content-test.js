import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | data table content', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`<DataTableContent />`);
    assert
      .dom('table.data-table')
      .exists({ count: 1 }, 'displays 1 data table');

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      <DataTableContent>
        template block text
      </DataTableContent>
    `);

    assert.dom('*').hasText('template block text');
  });
});
