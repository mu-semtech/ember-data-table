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

  // Template block usage:
  this.render(hbs`
    {{#data-table-menu-general}}
      template block text
    {{/data-table-menu-general}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
