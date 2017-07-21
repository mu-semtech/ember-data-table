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
