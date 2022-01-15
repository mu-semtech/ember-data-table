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

    await render(hbs`{{data-table-content-header data-table=data-table}}`);

    assert.dom('tr').exists({ count: 1 }, 'displays 1 header row');
    assert.equal(this.$('tr:first th').length, 3, 'displays 3 column headers');
    assert.equal(
      this.$('tr:first th:first').text().trim(),
      'firstName',
      'displays firstName as first header'
    );
    assert.equal(
      this.$('tr:first th:nth-child(2)').text().trim(),
      'lastName',
      'displays lastName as second column header'
    );
    assert.equal(
      this.$('tr:first th:nth-child(3)').text().trim(),
      'age',
      'displays age as third column header'
    );
  });

  test('add selection column header if enabled', async function (assert) {
    this.set('data-table', {});
    this.set('data-table.parsedFields', ['firstName', 'lastName', 'age']);

    await render(
      hbs`{{data-table-content-header data-table=data-table enableSelection=true}}`
    );

    assert.dom('tr').exists({ count: 1 }, 'displays 1 header row');
    assert.equal(this.$('tr:first th').length, 4, 'displays 4 column headers');
    assert.equal(
      this.$('tr:first th:first').text().trim(),
      '',
      'displays selection as first header'
    );
  });

  test('add line number column header if enabled', async function (assert) {
    this.set('data-table', {});
    this.set('data-table.parsedFields', ['firstName', 'lastName', 'age']);

    await render(
      hbs`{{data-table-content-header data-table=data-table enableLineNumbers=true}}`
    );

    assert.dom('tr').exists({ count: 1 }, 'displays 1 header row');
    assert.equal(this.$('tr:first th').length, 4, 'displays 4 column headers');
    assert.equal(
      this.$('tr:first th:first').text().trim(),
      '',
      'displays line number as first header'
    );
  });
});
