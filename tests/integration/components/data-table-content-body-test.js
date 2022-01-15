import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | data table content body', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    await render(hbs`{{data-table-content-body}}`);
    assert.dom('tbody').exists({ count: 1 });
  });

  test('display rows', async function (assert) {
    this.set('content', [
      { firstName: 'John', lastName: 'Doe', age: 20 },
      { firstName: 'Jane', lastName: 'Doe', age: 21 },
    ]);
    this.set('dataTable', {});
    this.set('dataTable.parsedFields', ['firstName', 'lastName', 'age']);
    this.set('dataTable.selection', []);

    await render(
      hbs`{{data-table-content-body content=content data-table=dataTable}}`
    );

    assert.dom('tr').exists({ count: 2 }, 'displays 2 rows');
    assert.equal(this.$('tr:first td').length, 3, 'displays 3 columns');
    assert.equal(
      this.$('tr:first td:first').text().trim(),
      'John',
      'displays firstName is first column'
    );
    assert.equal(
      this.$('tr:first td:nth-child(2)').text().trim(),
      'Doe',
      'displays lastName in second column'
    );
    assert.equal(
      this.$('tr:first td:nth-child(3)').text().trim(),
      '20',
      'displays age in third column'
    );
  });

  test('add checkboxes for selection if enabled', async function (assert) {
    const john = { firstName: 'John', lastName: 'Doe', age: 20 };
    const jane = { firstName: 'Jane', lastName: 'Doe', age: 21 };
    const jeff = { firstName: 'Jeff', lastName: 'Doe', age: 22 };
    this.set('content', [john, jane, jeff]);
    this.set('data-table', {});
    this.set('data-table.parsedFields', ['firstName', 'lastName', 'age']);
    this.set('data-table.selection', [jane]);

    await render(
      hbs`{{data-table-content-body content=content data-table=data-table enableSelection=true}}`
    );

    assert.equal(this.$('tr:first td').length, 4, 'displays 4 columns');
    assert.dom('tr.selected').exists({ count: 1 }, 'displays 1 selected row');
    assert
      .dom('tr input[type="checkbox"]')
      .exists({ count: 3 }, 'displays a checkbox on each row');
    assert
      .dom('tr input[type="checkbox"]:checked')
      .isChecked('displays 1 checked checkbox');
  });

  test('toggles selection if checkbox is clicked', async function (assert) {
    const john = { firstName: 'John', lastName: 'Doe', age: 20 };
    const jane = { firstName: 'Jane', lastName: 'Doe', age: 21 };
    const jeff = { firstName: 'Jeff', lastName: 'Doe', age: 22 };
    this.set('content', [john, jane, jeff]);
    this.set('data-table', {});
    this.set('data-table.parsedFields', ['firstName', 'lastName', 'age']);
    this.set('data-table.selection', [jane]);
    this.set('data-table.addItemToSelection', () =>
      this.set('data-table.selection', [john, jane])
    ); // mock function
    this.set('data-table.removeItemFromSelection', function () {}); // mock function

    await render(
      hbs`{{data-table-content-body content=content data-table=data-table enableSelection=true}}`
    );

    assert
      .dom('tr input[type="checkbox"]:checked')
      .isChecked('displays 1 checked checkbox before selecting a row');
    this.$('tr:first input[type="checkbox"]').click();
    assert
      .dom('tr input[type="checkbox"]:checked')
      .isChecked('displays 2 checked checkboxes after selecting a row');
  });

  test('add line numbers if enabled', async function (assert) {
    const john = { firstName: 'John', lastName: 'Doe', age: 20 };
    const jane = { firstName: 'Jane', lastName: 'Doe', age: 21 };
    const jeff = { firstName: 'Jeff', lastName: 'Doe', age: 22 };
    this.set('content', [john, jane, jeff]);
    this.set('data-table', {});
    this.set('data-table.parsedFields', ['firstName', 'lastName', 'age']);
    this.set('data-table.selection', []);

    await render(
      hbs`{{data-table-content-body content=content data-table=data-table enableLineNumbers=true}}`
    );

    assert.equal(this.$('tr:first td').length, 4, 'displays 4 columns');
    assert.equal(
      this.$('tr:first td:first').text().trim(),
      '1',
      'displays offset 1 on the first row'
    );
    assert.equal(
      this.$('tr:nth-child(2) td:first').text().trim(),
      '2',
      'displays offset 2 on the second row'
    );
    assert.equal(
      this.$('tr:nth-child(3) td:first').text().trim(),
      '3',
      'displays offset 3 on the third row'
    );

    this.set('data-table.page', 2);
    this.set('data-table.size', 5);
    await render(
      hbs`{{data-table-content-body content=content data-table=data-table enableLineNumbers=true}}`
    );

    assert.equal(
      this.$('tr:first td').length,
      4,
      'displays 4 columns on page 3'
    );
    assert.equal(
      this.$('tr:first td:first').text().trim(),
      '11',
      'displays offset 11 on the first row on page 3'
    );
    assert.equal(
      this.$('tr:nth-child(2) td:first').text().trim(),
      '12',
      'displays offset 12 on the second row on page 3'
    );
    assert.equal(
      this.$('tr:nth-child(3) td:first').text().trim(),
      '13',
      'displays offset 13 on the third row of page 3'
    );
  });

  test('displays no data message if there is no data', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });
    this.set('noDataMessage', 'No data');
    this.set('data-table', {});
    this.set('data-table.parsedFields', ['firstName', 'lastName', 'age']);
    this.set('data-table.selection', []);

    await render(
      hbs`{{data-table-content-body noDataMessage=noDataMessage data-table=data-table}}`
    );
    assert
      .dom('td.no-data-message')
      .exists({ count: 1 }, 'displays a no data message if no content');
    assert
      .dom('td.no-data-message')
      .hasText('No data', 'displays message "No data" if no content');

    this.set('content', []);
    await render(
      hbs`{{data-table-content-body content=content noDataMessage=noDataMessage data-table=data-table}}`
    );
    assert
      .dom('td.no-data-message')
      .exists({ count: 1 }, 'displays a no data message if empty content');
    assert
      .dom('td.no-data-message')
      .hasText('No data', 'displays message "No data" if empty content');

    this.set('content', ['foo', 'bar']);
    await render(
      hbs`{{data-table-content-body content=content noDataMessage=noDataMessage data-table=data-table}}`
    );
    assert
      .dom('td.no-data-message')
      .doesNotExist('displays no message when there is content');
  });
});
