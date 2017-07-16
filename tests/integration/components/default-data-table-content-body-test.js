import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('default-data-table-content-body', 'Integration | Component | default data table content body', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('data-table', { parsedFields: ['firstName', 'lastName', 'age'] });

  this.render(hbs`{{default-data-table-content-body data-table=data-table}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#default-data-table-content-body data-table=data-table}}
      template block text
    {{/default-data-table-content-body}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
