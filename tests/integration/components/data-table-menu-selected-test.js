import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('data-table-menu-selected', 'Integration | Component | data table menu selected', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{data-table-menu-selected}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#data-table-menu-selected}}
      template block text
    {{/data-table-menu-selected}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
