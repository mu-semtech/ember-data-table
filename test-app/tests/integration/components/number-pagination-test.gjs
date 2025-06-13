import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';
import { click, fillIn, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import RawDataTable from 'ember-data-table/components/raw-data-table';

import { generatePaginationMeta } from '../../helpers';

module('Integration | Component | number pagination', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    const page = 0;
    const meta = generatePaginationMeta(page, 10, 10);

    await render(
      <template><RawDataTable @page={{page}} @meta={{meta}} /></template>,
    );

    assert.dom('.raw-data-table .data-table-pagination').exists({ count: 1 });
  });

  test('page and size are reactive', async function (assert) {
    const content = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'John Smith' },
      { id: 4, name: 'Jane Smith' },
    ];
    const meta = generatePaginationMeta(0, 1, 4);

    class testContext {
      @tracked page = 0;
      @tracked size = 1;
    }

    const context = new testContext();

    await render(
      <template>
        <RawDataTable
          @fields="name"
          @content={{content}}
          @meta={{meta}}
          @page={{context.page}}
          @size={{context.size}}
          @updatePage={{fn (mut context.page)}}
          @updatePageSize={{fn (mut context.size)}}
        />
      </template>,
    );

    assert.equal(context.page, 0, 'initial page value is correct');
    await click('.data-table-pagination-right button:nth-child(3)'); // Next button
    assert.equal(context.page, 1, 'page value changed reactively');
    await click('.data-table-pagination-right button:nth-child(2)'); // Previous button
    assert.equal(context.page, 0, 'page value changed reactively back');
    await fillIn('.data-table-pagination-left select', '5');
    assert.equal(context.size, 5, 'size value changed reactively');
  });

  test('set sizes via @sizes', async function (assert) {
    const content = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'John Smith' },
      { id: 4, name: 'Jane Smith' },
    ];
    const meta = generatePaginationMeta(0, 1, 4);
    const sizes = [111, 222];
    const currentSize = 111; // the pagination will always render the current selected size too

    await render(
      <template>
        <RawDataTable
          @fields="name"
          @content={{content}}
          @meta={{meta}}
          @sizes={{sizes}}
          @size={{currentSize}}
        />
      </template>,
    );

    assert
      .dom('.data-table-pagination-left select option')
      .exists({ count: sizes.length }, 'does not render extra sizes');
    assert
      .dom('.data-table-pagination-left select option')
      .hasText('111', 'renders first size');
    assert
      .dom('.data-table-pagination-left select')
      .hasValue('111', 'renders first size');
    assert
      .dom('.data-table-pagination-left select option:last-child')
      .hasText('222', 'renders second size');
  });

  test('allow to disable sizes via @sizes', async function (assert) {
    const content = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
      { id: 3, name: 'John Smith' },
      { id: 4, name: 'Jane Smith' },
    ];
    const meta = generatePaginationMeta(0, 1, 4);
    const sizes = null;

    await render(
      <template>
        <RawDataTable
          @fields="name"
          @content={{content}}
          @meta={{meta}}
          @sizes={{sizes}}
        />
      </template>,
    );

    assert
      .dom('.data-table-pagination-left select')
      .doesNotExist('does not render size select if null');

    await render(
      <template>
        <RawDataTable
          @fields="name"
          @content={{content}}
          @meta={{meta}}
          @sizes=""
        />
      </template>,
    );

    assert
      .dom('.data-table-pagination-left select')
      .doesNotExist('does not render size select if empty string');
  });
});
