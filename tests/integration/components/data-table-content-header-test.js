import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('data-table-content-header', 'Integration | Component | data table content header', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{data-table-content-header}}`);
  assert.equal(this.$('thead').length, 1);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#data-table-content-header}}
      template block text
    {{/data-table-content-header}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

test('display column headers', function(assert) {
  this.set('data-table', {});
  this.set('data-table.parsedFields', ['firstName', 'lastName', 'age']);

  this.render(hbs`{{data-table-content-header data-table=data-table}}`);

  assert.equal(this.$('tr').length, 1, 'displays 1 header row');
  assert.equal(this.$('tr:first th').length, 3, 'displays 3 column headers');
  assert.equal(this.$('tr:first th:first').text().trim(), 'firstName', 'displays firstName as first header');
  assert.equal(this.$('tr:first th:nth-child(2)').text().trim(), 'lastName', 'displays lastName as second column header');
  assert.equal(this.$('tr:first th:nth-child(3)').text().trim(), 'age', 'displays age as third column header');
});

test('add selection column header if enabled', function(assert) {
  this.set('data-table', {});
  this.set('data-table.parsedFields', ['firstName', 'lastName', 'age']);

  this.render(hbs`{{data-table-content-header data-table=data-table enableSelection=true}}`);

  assert.equal(this.$('tr').length, 1, 'displays 1 header row');
  assert.equal(this.$('tr:first th').length, 4, 'displays 4 column headers');
  assert.equal(this.$('tr:first th:first').text().trim(), '', 'displays selection as first header');
});

test('add line number column header if enabled', function(assert) {
  this.set('data-table', {});
  this.set('data-table.parsedFields', ['firstName', 'lastName', 'age']);

  this.render(hbs`{{data-table-content-header data-table=data-table enableLineNumbers=true}}`);

  assert.equal(this.$('tr').length, 1, 'displays 1 header row');
  assert.equal(this.$('tr:first th').length, 4, 'displays 4 column headers');
  assert.equal(this.$('tr:first th:first').text().trim(), '', 'displays line number as first header');
});
