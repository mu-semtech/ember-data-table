import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | data table menu general', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`<DataTableMenuGeneral />`);

    assert.dom('*').hasText('');
  });

  test('it renders block only if data table selection is empty', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('data-table', { selectionIsEmpty: true });
    // Template block usage:
    await render(hbs`
      <DataTableMenuGeneral @data-table={{this.data-table}}>
        template block text
      </DataTableMenuGeneral>
    `);
    assert.dom('*').hasText('template block text');

    this.set('data-table', { selectionIsEmpty: false });
    // Template block usage:
    await render(hbs`
      <DataTableMenuGeneral @data-table={{this.data-table}}>
        template block text
      </DataTableMenuGeneral>
    `);

    assert.dom('*').hasText('');
  });
});
