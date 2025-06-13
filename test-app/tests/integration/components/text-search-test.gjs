import { fillIn, render, waitUntil } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import RawDataTable from 'ember-data-table/components/raw-data-table';

module('Integration | Component | text search', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders by default', async function (assert) {
    await render(<template><RawDataTable @filter="" /></template>);
    assert.dom('.raw-data-table .data-table-search').exists({ count: 1 });
  });

  test('it does not render if filter is not set', async function (assert) {
    await render(<template><RawDataTable /></template>);
    assert.dom('.raw-data-table .data-table-search').doesNotExist();
  });

  test('it does not render if enableSearch is false', async function (assert) {
    await render(
      <template><RawDataTable @enableSearch={{false}} @filter="" /></template>,
    );
    assert.dom('.raw-data-table .data-table-search').doesNotExist();
  });

  test('@searchPlaceholder text is rendered', async function (assert) {
    const searchPlaceholder = 'Search Placeholder Text';

    await render(
      <template>
        <RawDataTable @searchPlaceholder={{searchPlaceholder}} @filter="" />
      </template>,
    );
    assert
      .dom('.raw-data-table .data-table-search input')
      .hasAttribute(
        'placeholder',
        searchPlaceholder,
        'renders @searchPlaceholder',
      );
  });
  test('@searchPlaceholder text can be empty', async function (assert) {
    await render(
      <template><RawDataTable @searchPlaceholder="" @filter="" /></template>,
    );
    assert
      .dom('.raw-data-table .data-table-search input')
      .hasAttribute('placeholder', '', 'renders empty @searchPlaceholder');
  });

  test('@autoSearch calls @updateFilter after delay', async function (assert) {
    let filterValue = '';
    const updateFilter = (value) => {
      filterValue = value;
    };

    await render(
      <template>
        <RawDataTable @filter="" @updateFilter={{updateFilter}} />
      </template>,
    );

    fillIn('.raw-data-table .data-table-search input', 'test search');
    assert.strictEqual(
      filterValue,
      '',
      'update of filter has a debounce delay',
    );

    await waitUntil(() => filterValue != '', { timeout: 2000 });
    assert.strictEqual(
      filterValue,
      'test search',
      'filter updated after delay',
    );
  });
  test('@autoSearch default: calls @updateFilter after delay', async function (assert) {
    let filterValue = '';
    const updateFilter = (value) => {
      filterValue = value;
    };

    await render(
      <template>
        <RawDataTable @filter="" @updateFilter={{updateFilter}} />
      </template>,
    );

    fillIn('.raw-data-table .data-table-search input', 'test search');
    assert.strictEqual(
      filterValue,
      '',
      'update of filter has a debounce delay',
    );

    await waitUntil(() => filterValue != '', { timeout: 2000 });
    assert.strictEqual(
      filterValue,
      'test search',
      'filter updated after delay',
    );
  });

  test('@autoSearch=true calls @updateFilter after delay', async function (assert) {
    let filterValue = '';
    const updateFilter = (value) => {
      filterValue = value;
    };

    await render(
      <template>
        <RawDataTable
          @filter=""
          @updateFilter={{updateFilter}}
          @autoSearch={{true}}
        />
      </template>,
    );

    fillIn('.raw-data-table .data-table-search input', 'test search');
    assert.strictEqual(
      filterValue,
      '',
      'update of filter has a debounce delay',
    );

    await waitUntil(() => filterValue != '', { timeout: 2000 });
    assert.strictEqual(
      filterValue,
      'test search',
      'filter updated after delay',
    );
  });

  test('@autoSearch=number calls @updateFilter after small delay in ms', async function (assert) {
    let filterValue = '';
    const updateFilter = (value) => {
      filterValue = value;
    };

    await render(
      <template>
        <RawDataTable
          @filter=""
          @updateFilter={{updateFilter}}
          @autoSearch="10"
        />
      </template>,
    );

    fillIn('.raw-data-table .data-table-search input', 'test search');
    await waitUntil(() => filterValue != '', { timeout: 10 });
    assert.strictEqual(
      filterValue,
      'test search',
      'update of filter has no debounce delay (10ms)',
    );
  });

  test('@autoSearch=number calls @updateFilter after higher delay in ms', async function (assert) {
    let filterValue = '';
    const updateFilter = (value) => {
      filterValue = value;
    };

    await render(
      <template>
        <RawDataTable
          @filter=""
          @updateFilter={{updateFilter}}
          @autoSearch="4000"
        />
      </template>,
    );

    fillIn('.raw-data-table .data-table-search input', 'test search');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    assert.strictEqual(
      filterValue,
      '',
      'update of filter has higher than 2000ms debounce delay (4000ms)',
    );
    await waitUntil(() => filterValue != '', { timeout: 2000 });
    assert.strictEqual(
      filterValue,
      'test search',
      'update of filter after given debounce delay',
    );
  });
});
