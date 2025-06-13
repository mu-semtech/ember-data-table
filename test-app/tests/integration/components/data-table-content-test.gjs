import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import RawDataTable from 'ember-data-table/components/raw-data-table';

module('Integration | Component | data table content', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    await render(<template><RawDataTable /></template>);
    assert
      .dom('table.data-table')
      .exists({ count: 1 }, 'displays 1 data table');

    // Template block usage:
    await render(
      <template>
        <RawDataTable>
          <:content>
            template block text
          </:content>
        </RawDataTable>
      </template>,
    );

    assert.dom('*').includesText('template block text');
  });
});
