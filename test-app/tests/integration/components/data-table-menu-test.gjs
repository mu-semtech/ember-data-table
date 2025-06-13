import { tracked } from '@glimmer/tracking';
import { renderSettled } from '@ember/renderer';
import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import RawDataTable from 'ember-data-table/components/raw-data-table';

module('Integration | Component | data table menu', function (hooks) {
  setupRenderingTest(hooks);
  test('it renders', async function (assert) {
    await render(<template><RawDataTable /></template>);

    assert
      .dom('.data-table-menu')
      .exists({ count: 1 }, 'Menu container exists');

    // Template block usage:
    await render(
      <template>
        <RawDataTable>
          <:menu>
            template block text
          </:menu>
        </RawDataTable>
      </template>,
    );

    assert.dom('.raw-data-table').containsText('template block text');
  });

  test('can toggle menu with @showMenu', async function (assert) {
    class testContext {
      @tracked showMenu;
    }

    const context = new testContext();

    context.showMenu = true;
    await render(
      <template><RawDataTable @showMenu={{context.showMenu}} /></template>,
    );

    assert
      .dom('.data-table-menu')
      .exists({ count: 1 }, 'Menu container exists');

    context.showMenu = false;
    await renderSettled();
    assert
      .dom('.data-table-menu')
      .doesNotExist('Menu container does not exist');
  });
});
