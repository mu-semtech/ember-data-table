import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';
import { click, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import RawDataTable from 'ember-data-table/components/raw-data-table';

module('Integration | Component | th sortable', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    const fields = ['title'];
    const sortableFields = ['title'];

    await render(
      <template>
        <RawDataTable @fields={{fields}} @sortableFields={{sortableFields}} />
      </template>,
    );

    assert.dom('.data-table .sortable').exists({ count: 1 });
  });

  test('sort is reactive', async function (assert) {
    const content = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ];

    class testContext {
      @tracked sort = '';
    }

    const context = new testContext();

    await render(
      <template>
        <RawDataTable
          @content={{content}}
          @fields="name"
          @sortableFields="name"
          @sort={{context.sort}}
          @updateSort={{fn (mut context.sort)}}
        />
      </template>,
    );

    assert.equal(context.sort, '', 'initial sort value is correct');
    await click('.raw-data-table .sortable span');
    assert.equal(context.sort, 'name', 'sort value changed reactively');
    await click('.raw-data-table .sortable span');
    assert.equal(
      context.sort,
      '-name',
      'sort value changed reactively in correct order',
    );
    await click('.raw-data-table .sortable span');
    assert.equal(
      context.sort,
      null,
      'sort value got cleared after three clicks',
    );
  });

  test('fields are sortable by default', async function (assert) {
    const content = [{ id: 1, name: 'John Doe' }];

    await render(
      <template><RawDataTable @content={{content}} @fields="name" /></template>,
    );

    assert
      .dom('.raw-data-table .sortable span')
      .exists({ count: 1 }, 'sortable span exists');
    assert
      .dom('.raw-data-table .sortable span')
      .containsText('name', 'sortable span contains name');
  });

  test('disable sorting with empty string or list', async function (assert) {
    const content = [{ id: 1, name: 'John Doe' }];

    await render(
      <template>
        <RawDataTable @content={{content}} @fields="name" @sortableFields="" />
      </template>,
    );

    assert
      .dom('.raw-data-table .sortable span')
      .doesNotExist('no sortable header if empty string');

    const emptyList = [];

    await render(
      <template>
        <RawDataTable
          @content={{content}}
          @fields="name"
          @sortableFields={{emptyList}}
        />
      </template>,
    );

    assert
      .dom('.raw-data-table .sortable span')
      .doesNotExist('no sortable header if empty array');

    await render(
      <template>
        <RawDataTable
          @content={{content}}
          @fields="name"
          @sortableFields="InexistingField"
        />
      </template>,
    );
    assert
      .dom('.raw-data-table .sortable span')
      .doesNotExist('no sortable header if inexistent field');
  });

  test('set custom sorting params via @attributeToSortParams', async function (assert) {
    const content = [{ id: 1, name: 'John Doe' }];

    function customSort(attribute) {
      return {
        'custom1 asc': `++${attribute}`,
        'custom2 desc': `--${attribute}`,
        'custom3 asc desc': `++--${attribute}`,
      };
    }

    class Context {
      @tracked sort = '';
    }

    const context = new Context();

    await render(
      <template>
        <RawDataTable
          @content={{content}}
          @fields="name"
          @sort={{context.sort}}
          @updateSort={{fn (mut context.sort)}}
          @attributeToSortParams={{customSort}}
        />
      </template>,
    );

    assert
      .dom('.raw-data-table .sortable span')
      .exists({ count: 1 }, 'sortable span exists');
    assert
      .dom('.raw-data-table .sortable span')
      .containsText('name', 'sortable span contains name');
    assert.equal(context.sort, '', 'initial sort value is no sort');
    await click('.raw-data-table .sortable span');
    assert.equal(context.sort, '++name', 'sort value changed reactively');
    await click('.raw-data-table .sortable span');
    assert.equal(
      context.sort,
      '--name',
      'sort value changed reactively in correct order',
    );
    await click('.raw-data-table .sortable span');
    assert.equal(
      context.sort,
      '++--name',
      'sort value changed reactively in correct order',
    );
    await click('.raw-data-table .sortable span');
    assert.equal(
      context.sort,
      null,
      'sort value got cleared after four clicks',
    );
  });
});
