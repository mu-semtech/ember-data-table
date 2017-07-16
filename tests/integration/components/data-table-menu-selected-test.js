import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('data-table-menu-selected', 'Integration | Component | data table menu selected', {
  integration: true
});

test('it renders block only if data table selection is not empty', function(assert) {
  this.set('data-table', { selectionIsEmpty: true });
  // Template block usage:
  this.render(hbs`
    {{#data-table-menu-selected data-table=data-table}}
      template block text
    {{/data-table-menu-selected}}
  `);
  assert.equal(this.$().text().trim(), '');
});

test('it renders selection count', function(assert) {
  this.set('data-table', { selectionIsEmpty: false, selection: ['foo'] });
  // Template block usage:
  this.render(hbs`
    {{#data-table-menu-selected data-table=data-table}}
      template block text
    {{/data-table-menu-selected}}
  `);

  assert.equal(this.$('span.item-count').text().trim(), '1 item(s) selected', 'item count 1');

  this.set('data-table', { selectionIsEmpty: false, selection: ['foo', 'bar'] });
  // Template block usage:
  this.render(hbs`
    {{#data-table-menu-selected data-table=data-table}}
      template block text
    {{/data-table-menu-selected}}
  `);

  assert.equal(this.$('span.item-count').text().trim(), '2 item(s) selected', 'item count 2');
});

test('calls clearSelection on cancel button click', function(assert) {
  assert.expect(2); // 2 asserts in this test

  this.set('data-table', { selectionIsEmpty: false, selection: ['foo']});
  this.set('data-table.clearSelection', function() {
    assert.ok(true, 'data-table.clearSelection gets called');
  });
  // Template block usage:
  this.render(hbs`
    {{#data-table-menu-selected data-table=data-table}}
      template block text
    {{/data-table-menu-selected}}
  `);

  assert.equal(this.$('button').text().trim(), 'Cancel', 'renders a cancel button');
  this.$('button').click();
});
