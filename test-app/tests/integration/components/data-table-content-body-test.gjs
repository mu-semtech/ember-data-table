import { tracked } from '@glimmer/tracking';
import { fn } from '@ember/helper';
import { renderSettled } from '@ember/renderer';
import { LinkTo } from '@ember/routing';
import { click, render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import RawDataTable from 'ember-data-table/components/raw-data-table';
import { or } from 'ember-truth-helpers';

import { generatePaginationMeta } from '../../helpers';

module('Integration | Component | data table content body', function (hooks) {
  setupRenderingTest(hooks);

  test('display rows', async function (assert) {
    const content = [
      { firstName: 'John', lastName: 'Doe', age: 20 },
      { firstName: 'Jane', lastName: 'Doe', age: 21 },
    ];
    const fields = ['firstName', 'lastName', 'age'];

    await render(
      <template>
        <RawDataTable @content={{content}} @fields={{fields}} />
      </template>,
    );

    assert.dom('tbody>tr').exists({ count: 2 }, 'displays 2 rows');
    assert
      .dom('tbody>tr:first-child td')
      .exists({ count: 3 }, 'displays 3 columns');
    assert
      .dom('tbody>tr:first-child td:first-child')
      .hasText('John', 'displays firstName in first column');
    assert
      .dom('tbody>tr:first-child td:nth-child(2)')
      .hasText('Doe', 'displays lastName in second column');
    assert
      .dom('tbody>tr:first-child td:nth-child(3)')
      .hasText('20', 'displays age in third column');
  });

  test('add checkboxes for selection if enabled and allow initial selection', async function (assert) {
    const john = { firstName: 'John', lastName: 'Doe', age: 20 };
    const jane = { firstName: 'Jane', lastName: 'Doe', age: 21 };
    const jeff = { firstName: 'Jeff', lastName: 'Doe', age: 22 };
    const content = [john, jane, jeff];
    const fields = ['firstName', 'lastName', 'age'];
    const initialSelection = [jane];

    class Context {
      @tracked enableSelection;
    }

    const context = new Context();

    context.enableSelection = true;

    await render(
      <template>
        <RawDataTable
          @content={{content}}
          @fields={{fields}}
          @initialSelection={{initialSelection}}
          @enableSelection={{context.enableSelection}}
        />
      </template>,
    );

    assert
      .dom('tbody>tr:first-child td')
      .exists({ count: 4 }, 'displays 4 columns');
    assert
      .dom('tbody>tr.selected')
      .exists({ count: 1 }, 'displays 1 selected row');
    assert
      .dom('tbody>tr input[type="checkbox"]')
      .exists({ count: 3 }, 'displays a checkbox on each row');
    assert
      .dom('tbody>tr input[type="checkbox"]:checked')
      .isChecked('displays 1 checked checkbox');

    context.enableSelection = false;
    await renderSettled();

    assert
      .dom('tbody>tr:first-child td')
      .exists(
        { count: 3 },
        'reactivity: displays 3 columns when selection disabled',
      );
    assert
      .dom('tbody>tr.selected')
      .doesNotExist('reactivity: no selected rows when selection disabled');
    assert
      .dom('tbody>tr input[type="checkbox"]')
      .doesNotExist('reactivity: no checkboxes when selection disabled');
  });

  test('toggles selection if checkbox is clicked', async function (assert) {
    const john = { firstName: 'John', lastName: 'Doe', age: 20 };
    const jane = { firstName: 'Jane', lastName: 'Doe', age: 21 };
    const jeff = { firstName: 'Jeff', lastName: 'Doe', age: 22 };
    const content = [john, jane, jeff];
    const fields = ['firstName', 'lastName', 'age'];
    const selection = [jane];

    await render(
      <template>
        <RawDataTable
          @content={{content}}
          @fields={{fields}}
          @enableSelection={{true}}
          @initialSelection={{selection}}
        />
      </template>,
    );

    assert
      .dom('tbody>tr input[type="checkbox"]:checked')
      .isChecked('displays 1 checked checkbox before selecting a row');
    await click('tbody>tr:first-child input[type="checkbox"]');
    assert
      .dom('tbody>tr input[type="checkbox"]:checked')
      .isChecked('displays 2 checked checkboxes after selecting a row');
  });

  test('keep selection intact over page changes', async function (assert) {
    const john = { firstName: 'John', lastName: 'Doe', age: 20 };
    const jane = { firstName: 'Jane', lastName: 'Doe', age: 21 };
    const jeff = { firstName: 'Jeff', lastName: 'Doe', age: 22 };
    const content = [john, jane, jeff];
    const fields = ['firstName', 'lastName', 'age'];
    const selection = [];
    const meta = generatePaginationMeta(0, 1, 3);

    class testContext {
      @tracked page = 0;
      @tracked size = 1;
      @tracked content;
    }

    const context = new testContext();

    context.content = [john];

    const changePage = (page) => {
      context.page = page;
      context.content = [content[page]];
    };

    await render(
      <template>
        <RawDataTable
          @content={{context.content}}
          @fields={{fields}}
          @enableSelection={{true}}
          @initialSelection={{selection}}
          @page={{context.page}}
          @size={{context.size}}
          @updatePage={{changePage}}
          @updatePageSize={{fn (mut context.size)}}
          @meta={{meta}}
        />
      </template>,
    );

    await click('tbody>tr:nth-child(1) input[type="checkbox"]');
    assert
      .dom('tbody>tr input[type="checkbox"]:checked')
      .isChecked('displays 1 checked checkbox after selecting a row');

    await click('.data-table-pagination-right button:nth-child(3)'); // Next button
    assert
      .dom('tbody>tr input[type="checkbox"]')
      .isNotChecked('no selection on next page');
    await click('.data-table-pagination-right button:nth-child(2)'); // Previous button
    assert
      .dom('tbody>tr input[type="checkbox"]:checked')
      .isChecked('selection intact on first page after page change');
  });

  test('add line numbers if enabled', async function (assert) {
    const john = { firstName: 'John', lastName: 'Doe', age: 20 };
    const jane = { firstName: 'Jane', lastName: 'Doe', age: 21 };
    const jeff = { firstName: 'Jeff', lastName: 'Doe', age: 22 };
    const content = [john, jane, jeff];
    const fields = ['firstName', 'lastName', 'age'];

    class testContext {
      @tracked enableLineNumbers;
    }

    const context = new testContext();

    context.enableLineNumbers = true;

    await render(
      <template>
        <RawDataTable
          @content={{content}}
          @fields={{fields}}
          @enableLineNumbers={{context.enableLineNumbers}}
        />
      </template>,
    );

    assert
      .dom('tbody>tr:first-child td')
      .exists({ count: 4 }, 'displays 4 columns');
    assert
      .dom('tbody>tr:first-child td:first-child')
      .hasText('1', 'displays offset 1 on the first row');
    assert
      .dom('tbody>tr:nth-child(2) td:first-child')
      .hasText('2', 'displays offset 2 on the second row');
    assert
      .dom('tbody>tr:nth-child(3) td:first-child')
      .hasText('3', 'displays offset 3 on the third row');
    context.enableLineNumbers = false;
    await renderSettled();

    assert
      .dom('tbody>tr:first-child td')
      .exists(
        { count: 3 },
        'reactivity: displays 3 columns (no line numbers column) when line numbers disabled',
      );

    context.enableLineNumbers = true;

    const page = 2;
    const size = 5;

    await render(
      <template>
        <RawDataTable
          @content={{content}}
          @fields={{fields}}
          @enableLineNumbers={{true}}
          @page={{page}}
          @size={{size}}
        />
      </template>,
    );

    assert
      .dom('tbody>tr:first-child td')
      .exists({ count: 4 }, 'displays 4 columns on page 3');
    assert
      .dom('tbody>tr:first-child td:first-child')
      .hasText('11', 'displays offset 11 on the first row on page 3');
    assert
      .dom('tbody>tr:nth-child(2) td:first-child')
      .hasText('12', 'displays offset 12 on the second row on page 3');
    assert
      .dom('tbody>tr:nth-child(3) td:first-child')
      .hasText('13', 'displays offset 13 on the third row of page 3');
  });

  test('@selection and @updateSelection work', async function (assert) {
    const john = { firstName: 'John', lastName: 'Doe', age: 20 };
    const jane = { firstName: 'Jane', lastName: 'Doe', age: 21 };
    const jeff = { firstName: 'Jeff', lastName: 'Doe', age: 22 };
    const content = [john, jane, jeff];
    const fields = ['firstName', 'lastName', 'age'];

    class Context {
      @tracked selection;
    }

    const context = new Context();

    context.selection = [jane];

    const updateSelection = (newSelection) => {
      context.selection = newSelection;
    };

    await render(
      <template>
        <RawDataTable
          @content={{content}}
          @fields={{fields}}
          @enableSelection={{true}}
          @selection={{context.selection}}
          @updateSelection={{updateSelection}}
        />
      </template>,
    );
    assert
      .dom('tbody>tr:nth-child(2) input[type="checkbox"]:checked')
      .isChecked(
        'displays 1 checked checkbox on second row before selecting another row',
      );
    await click('tbody>tr:first-child input[type="checkbox"]');
    assert
      .dom('tbody>tr:nth-child(1) input[type="checkbox"]:checked')
      .isChecked(
        'displays 2 checked checkboxes after selecting a row (first row)',
      );
    assert
      .dom('tbody>tr:nth-child(2) input[type="checkbox"]:checked')
      .isChecked(
        'displays 2 checked checkboxes after selecting a row (second row)',
      );
    assert.propEqual(context.selection, [jane, john], 'selection is updated');
    await click('tbody>tr:first-child input[type="checkbox"]');
    assert.propEqual(context.selection, [jane], 'selection is updated');
  });

  test('displays no data message if there is no data', async function (assert) {
    const noDataMessage = 'No data';
    const dataTable = {
      parsedFields: ['firstName', 'lastName', 'age'],
      selection: [],
    };

    await render(
      <template>
        <RawDataTable
          @noDataMessage={{noDataMessage}}
          @dataTable={{dataTable}}
        />
      </template>,
    );
    assert
      .dom('td.no-data-message')
      .exists({ count: 1 }, 'displays a no data message if no content');
    assert
      .dom('td.no-data-message')
      .hasText('No data', 'displays message "No data" if no content');

    const emptyContent = [];

    await render(
      <template>
        <RawDataTable
          @content={{emptyContent}}
          @noDataMessage={{noDataMessage}}
          @dataTable={{dataTable}}
        />
      </template>,
    );
    assert
      .dom('td.no-data-message')
      .exists({ count: 1 }, 'displays a no data message if empty content');
    assert
      .dom('td.no-data-message')
      .hasText('No data', 'displays message "No data" if empty content');

    const content = ['foo', 'bar'];

    await render(
      <template>
        <RawDataTable
          @content={{content}}
          @noDataMessage={{noDataMessage}}
          @dataTable={{dataTable}}
        />
      </template>,
    );
    assert
      .dom('td.no-data-message')
      .doesNotExist('displays no message when there is content');
  });

  test('@links property adds a links to every column', async function (assert) {
    class testContext {
      @tracked links;
    }

    const context = new testContext();

    context.links = [
      'edit',
      'edit:Edit_Link',
      'edit:Edit_Link:icon-reference',
      { route: 'edit' },
      { route: 'edit', label: 'Edit:Link' },
      { route: 'edit', label: 'Edit:Link', icon: 'icon:reference' },
    ];

    const content = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ];

    await render(
      <template>
        <RawDataTable
          @content={{content}}
          @fields="name"
          @links={{context.links}}
        />
      </template>,
    );

    assert
      .dom('tbody>tr:first-child td:nth-child(2) a:first-child')
      .hasText('edit', 'string config: renders edit link');
    assert
      .dom('tbody>tr:first-child td:nth-child(2) a:nth-child(2)')
      .hasText('Edit Link', 'string config: renders edit link with label');
    assert
      .dom('tbody>tr:first-child td:nth-child(2) a:nth-child(3)')
      .hasText('Edit Link', 'string config: renders icon edit link with label');
    assert
      .dom('tbody>tr:first-child td:nth-child(2) a:nth-child(4)')
      .hasText('edit', 'object config: renders edit link');
    assert
      .dom('tbody>tr:first-child td:nth-child(2) a:nth-child(5)')
      .hasText('Edit:Link', 'object config: renders edit link with label');
    assert
      .dom('tbody>tr:first-child td:nth-child(2) a:nth-child(6)')
      .hasText('Edit:Link', 'object config: renders icon edit link with label');

    assert
      .dom('tbody>tr:nth-child(2) td:nth-child(2) a:first-child')
      .hasText('edit', 'string config: renders edit link');
    assert
      .dom('tbody>tr:nth-child(2) td:nth-child(2) a:nth-child(2)')
      .hasText('Edit Link', 'string config: renders edit link with label');
    assert
      .dom('tbody>tr:nth-child(2) td:nth-child(2) a:nth-child(3)')
      .hasText('Edit Link', 'string config: renders icon edit link with label');
    assert
      .dom('tbody>tr:nth-child(2) td:nth-child(2) a:nth-child(4)')
      .hasText('edit', 'object config: renders edit link');
    assert
      .dom('tbody>tr:nth-child(2) td:nth-child(2) a:nth-child(5)')
      .hasText('Edit:Link', 'object config: renders edit link with label');
    assert
      .dom('tbody>tr:nth-child(2) td:nth-child(2) a:nth-child(6)')
      .hasText('Edit:Link', 'object config: renders icon edit link with label');

    context.links = [];
    await renderSettled();

    assert
      .dom('tbody>tr:first-child td:nth-child(2) a')
      .doesNotExist('reactivity: no links when links is empty');
  });

  test('@links property data is provided for :actions: block', async function (assert) {
    const links = [
      'edit',
      'edit:Edit_Link',
      'edit:Edit_Link:icon-reference',
      { route: 'edit' },
      { route: 'edit', label: 'Edit:Link' },
      { route: 'edit', label: 'Edit:Link', icon: 'icon:reference' },
    ];

    const content = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Doe' },
    ];

    await render(
      <template>
        <RawDataTable @content={{content}} @fields="name" @links={{links}}>
          <:actions as |row|>
            <td>
              test
              {{#each row.linkedRoutes as |linkedRoute|}}
                {{linkedRoute.route}}
                <LinkTo
                  @route={{linkedRoute.route}}
                  @model={{linkedRoute.model}}
                >
                  model:
                  {{linkedRoute.model}}
                  {{#if linkedRoute.icon}} icon: {{linkedRoute.icon}} {{/if}}
                  {{! this is the same logic as raw-data-table }}
                  {{or linkedRoute.label linkedRoute.route}}
                </LinkTo>
              {{/each}}
            </td>
          </:actions>
        </RawDataTable>
      </template>,
    );

    assert
      .dom('tbody>tr:first-child td a:first-child')
      .hasText('model: 1 edit', 'string config: renders edit link');
    assert
      .dom('tbody>tr:first-child td a:nth-child(2)')
      .hasText(
        'model: 1 Edit Link',
        'string config: renders edit link with label',
      );
    assert
      .dom('tbody>tr:first-child td a:nth-child(3)')
      .hasText(
        'model: 1 icon: icon-reference Edit Link',
        'string config: renders icon edit link with label',
      );
    assert
      .dom('tbody>tr:first-child td a:nth-child(4)')
      .hasText('model: 1 edit', 'object config: renders edit link');
    assert
      .dom('tbody>tr:first-child td a:nth-child(5)')
      .hasText(
        'model: 1 Edit:Link',
        'object config: renders edit link with label',
      );
    assert
      .dom('tbody>tr:first-child td a:nth-child(6)')
      .hasText(
        'model: 1 icon: icon:reference Edit:Link',
        'object config: renders icon edit link with label',
      );

    assert
      .dom('tbody>tr:nth-child(2) td a:first-child')
      .hasText('model: 2 edit', '2nd column: string config: renders edit link');
    assert
      .dom('tbody>tr:nth-child(2) td a:nth-child(2)')
      .hasText(
        'model: 2 Edit Link',
        '2nd column: string config: renders edit link with label',
      );
    assert
      .dom('tbody>tr:nth-child(2) td a:nth-child(3)')
      .hasText(
        'model: 2 icon: icon-reference Edit Link',
        '2nd column: string config: renders icon edit link with label',
      );
    assert
      .dom('tbody>tr:nth-child(2) td a:nth-child(4)')
      .hasText('model: 2 edit', '2nd column: object config: renders edit link');
    assert
      .dom('tbody>tr:nth-child(2) td a:nth-child(5)')
      .hasText(
        'model: 2 Edit:Link',
        '2nd column: object config: renders edit link with label',
      );
    assert
      .dom('tbody>tr:nth-child(2) td a:nth-child(6)')
      .hasText(
        'model: 2 icon: icon:reference Edit:Link',
        '2nd column: object config: renders icon edit link with label',
      );
  });

  test('@linksModelProperty adds model to the link', async function (assert) {
    const links = [
      'edit',
      'edit:Edit_Link',
      'edit:Edit_Link:icon-reference',
      { route: 'edit' },
      { route: 'edit', label: 'Edit:Link' },
      { route: 'edit', label: 'Edit:Link', icon: 'icon:reference' },
    ];

    const content = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ];

    await render(
      <template>
        <RawDataTable
          @content={{content}}
          @fields="name"
          @links={{links}}
          @linksModelProperty="name"
        >
          <:actions as |row|>
            <td>
              test
              {{#each row.linkedRoutes as |linkedRoute|}}
                {{linkedRoute.route}}
                <LinkTo
                  @route={{linkedRoute.route}}
                  @model={{linkedRoute.model}}
                >
                  model:
                  {{linkedRoute.model}}
                  {{#if linkedRoute.icon}} icon: {{linkedRoute.icon}} {{/if}}
                  {{! this is the same logic as raw-data-table }}
                  {{or linkedRoute.label linkedRoute.route}}
                </LinkTo>
              {{/each}}
            </td>
          </:actions>
        </RawDataTable>
      </template>,
    );

    assert
      .dom('tbody>tr:first-child td a:first-child')
      .hasText('model: John edit', 'string config: renders edit link');
    assert
      .dom('tbody>tr:first-child td a:nth-child(2)')
      .hasText(
        'model: John Edit Link',
        'string config: renders edit link with label',
      );
    assert
      .dom('tbody>tr:first-child td a:nth-child(3)')
      .hasText(
        'model: John icon: icon-reference Edit Link',
        'string config: renders icon edit link with label',
      );
    assert
      .dom('tbody>tr:first-child td a:nth-child(4)')
      .hasText('model: John edit', 'object config: renders edit link');
    assert
      .dom('tbody>tr:first-child td a:nth-child(5)')
      .hasText(
        'model: John Edit:Link',
        'object config: renders edit link with label',
      );
    assert
      .dom('tbody>tr:first-child td a:nth-child(6)')
      .hasText(
        'model: John icon: icon:reference Edit:Link',
        'object config: renders icon edit link with label',
      );

    assert
      .dom('tbody>tr:nth-child(2) td a:first-child')
      .hasText(
        'model: Jane edit',
        '2nd column: string config: renders edit link',
      );
    assert
      .dom('tbody>tr:nth-child(2) td a:nth-child(2)')
      .hasText(
        'model: Jane Edit Link',
        '2nd column: string config: renders edit link with label',
      );
    assert
      .dom('tbody>tr:nth-child(2) td a:nth-child(3)')
      .hasText(
        'model: Jane icon: icon-reference Edit Link',
        '2nd column: string config: renders icon edit link with label',
      );
    assert
      .dom('tbody>tr:nth-child(2) td a:nth-child(4)')
      .hasText(
        'model: Jane edit',
        '2nd column: object config: renders edit link',
      );
    assert
      .dom('tbody>tr:nth-child(2) td a:nth-child(5)')
      .hasText(
        'model: Jane Edit:Link',
        '2nd column: object config: renders edit link with label',
      );
    assert
      .dom('tbody>tr:nth-child(2) td a:nth-child(6)')
      .hasText(
        'model: Jane icon: icon:reference Edit:Link',
        '2nd column: object config: renders icon edit link with label',
      );
  });

  test('@onClickRow adds a click handler to the row', async function (assert) {
    const content = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
    ];

    const onClickRow = () => {
      assert.step('clicked');
    };

    await render(
      <template>
        <RawDataTable
          @content={{content}}
          @fields="name"
          @onClickRow={{onClickRow}}
        />
      </template>,
    );

    await click('tbody>tr:first-child');
    assert.verifySteps(['clicked']);
    await click('tbody>tr:nth-child(2)');
    assert.verifySteps(['clicked']);
  });
});
