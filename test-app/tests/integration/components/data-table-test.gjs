import { tracked } from '@glimmer/tracking';
import { renderSettled } from '@ember/renderer';
import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import RawDataTable from 'ember-data-table/components/raw-data-table';

module('Integration | Component | data table', function (hooks) {
  setupRenderingTest(hooks);
  test('it renders', async function (assert) {
    const content = [];
    const meta = {
      pagination: {
        first: { number: 1 },
        last: { number: 10 },
      },
    };

    await render(
      <template>
        <RawDataTable @content={{content}} @meta={{meta}} @sizes="" />
      </template>,
    );

    assert.dom('.raw-data-table').exists({ count: 1 }, 'renders a data table');
    assert
      .dom('.raw-data-table .data-table-content')
      .exists({ count: 1 }, 'renders table inside content container');
  });

  test('content is reactive', async function (assert) {
    class testContext {
      @tracked content = [];
    }

    const context = new testContext();

    context.content = [];

    await render(
      <template>
        <RawDataTable @content={{context.content}} @fields="name" />
      </template>,
    );

    assert.dom('.raw-data-table').exists({ count: 1 }, 'renders a data table');

    assert
      .dom('.raw-data-table tbody tr')
      .doesNotContainText(
        'new person',
        'do not render rows when content is empty',
      );
    context.content = [{ id: 1, name: 'new person' }];
    await renderSettled();

    assert
      .dom('.raw-data-table tbody tr')
      .exists({ count: 1 }, 'add row for new person');
    assert
      .dom('.raw-data-table tbody tr:nth-child(1)')
      .containsText('new person', 'renders new person');
  });

  test('attribute @noDataMessage', async function (assert) {
    const content = [];
    const noDataMessage = 'No data';

    await render(
      <template>
        <RawDataTable @content={{content}} @noDataMessage={{noDataMessage}} />
      </template>,
    );

    assert
      .dom('.raw-data-table .no-data-message')
      .exists({ count: 1 }, 'No data message renders if content empty');
    assert
      .dom('.raw-data-table .no-data-message')
      .containsText(noDataMessage, 'renders @noDataMessage');
  });

  test('no data message block', async function (assert) {
    const content = [];

    await render(
      <template>
        <RawDataTable @content={{content}}>
          <:no-data-message>
            <div class="no-data-message-block">template block text</div>
          </:no-data-message>
        </RawDataTable>
      </template>,
    );

    assert
      .dom('.raw-data-table .no-data-message-block')
      .exists({ count: 1 }, 'No data message renders if content empty');
    assert
      .dom('.raw-data-table .no-data-message-block')
      .containsText('template block text', 'renders template block');
  });
});
