import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | data table menu', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`<DataTableMenu />`);

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      <DataTableMenu>
        template block text
      </DataTableMenu>
    `);

    assert.dom('*').hasText('template block text');
  });
});
