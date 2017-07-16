import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('data-table-content', 'Integration | Component | data table content', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{data-table-content}}`);
  assert.equal(this.$('table.data-table').length, 1, 'displays 1 data table');

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#data-table-content}}
      template block text
    {{/data-table-content}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});

test('displays no data message if there is no data', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });
  this.set('noDataMessage', 'No data');
  this.set('data-table', {});
  this.set('data-table.parsedFields', ['firstName', 'lastName', 'age']);
  this.set('data-table.selection', []);

  this.render(hbs`{{data-table-content noDataMessage=noDataMessage data-table=data-table}}`);
  assert.equal(this.$('table.data-table p.no-data-message').length, 1, 'displays a no data message if no content');
  assert.equal(this.$('table.data-table p.no-data-message').text().trim(), 'No data', 'displays message "No data" if no content');

  this.set('content', [])
  this.render(hbs`{{data-table-content content=content noDataMessage=noDataMessage data-table=data-table}}`);
  assert.equal(this.$('table.data-table p.no-data-message').length, 1, 'displays a no data message if empty content');
  assert.equal(this.$('table.data-table p.no-data-message').text().trim(), 'No data', 'displays message "No data" if empty content');

  this.set('content', ['foo', 'bar'])
  this.render(hbs`{{data-table-content content=content noDataMessage=noDataMessage data-table=data-table}}`);
  assert.equal(this.$('table.data-table p.no-data-message').length, 0, 'displays no message when there is content');

});
