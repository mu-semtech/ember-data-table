import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | data table content header', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    await render(hbs`{{data-table-content-header}}`);
    assert.dom('thead').exists({ count: 1 });

    assert.dom('*').hasText('');

    // Template block usage:
    await render(hbs`
      {{#data-table-content-header}}
        template block text
      {{/data-table-content-header}}
    `);

    assert.dom('*').hasText('template block text');
  });

  test('display column headers', async function (assert) {
    this.set('data-table', {});
    this.set('data-table.parsedFields', ['firstName', 'lastName', 'age']);

    await render(hbs`{{data-table-content-header data-table=this.data-table}}`);

    assert.dom('tr').exists({ count: 1 }, 'displays 1 header row');
    assert.dom('tr:first-child th').exists({ count: 3}, 'displays 3 column headers');
    assert.dom('tr:first-child th:first-child').hasText(
      'firstName',
      'displays firstName as first header'
    );
    assert.dom('tr:first-child th:nth-child(2)').hasText(
      'lastName',
      'displays lastName as second column header'
    );
    assert.dom('tr:first-child th:nth-child(3)').hasText(
      'age',
      'displays age as third column header'
    );
  });

  test('add selection column header if enabled', async function (assert) {
    this.set('data-table', {});
    this.set('data-table.parsedFields', ['firstName', 'lastName', 'age']);

    await render(
      hbs`{{data-table-content-header data-table=this.data-table enableSelection=true}}`
    );

    assert.dom('tr').exists({ count: 1 }, 'displays 1 header row');
    assert.dom('tr:first-child th').exists({ count: 4 }, 'displays 4 column headers');
    assert.dom('tr:first-child th:first-child').hasText(
      '',
      'displays selection as first header'
    );
  });

  test('add line number column header if enabled', async function (assert) {
    this.set('data-table', {});
    this.set('data-table.parsedFields', ['firstName', 'lastName', 'age']);

    await render(
      hbs`{{data-table-content-header data-table=this.data-table enableLineNumbers=true}}`
    );

    assert.dom('tr').exists({ count: 1 }, 'displays 1 header row');
    assert.dom('tr:first-child th').exists({ count: 4 }, 'displays 4 column headers');
    assert.dom('tr:first-child th:first-child').hasText(
      '',
      'displays line number as first header'
    );
  });
});
