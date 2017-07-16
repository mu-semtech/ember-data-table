import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('data-table-menu-general', 'Integration | Component | data table menu general', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{data-table-menu-general}}`);

  assert.equal(this.$().text().trim(), '');
});

test('it renders block only if data table selection is empty', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('data-table', { selectionIsEmpty: true });
  // Template block usage:
  this.render(hbs`
    {{#data-table-menu-general data-table=data-table}}
      template block text
    {{/data-table-menu-general}}
  `);
  assert.equal(this.$().text().trim(), 'template block text');

  this.set('data-table', { selectionIsEmpty: false });
  // Template block usage:
  this.render(hbs`
    {{#data-table-menu-general data-table=data-table}}
      template block text
    {{/data-table-menu-general}}
  `);

  assert.equal(this.$().text().trim(), '');
});
