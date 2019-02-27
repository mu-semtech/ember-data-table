import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | default data table content body', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('data-table', { parsedFields: ['firstName', 'lastName', 'age'] });

    await render(hbs`{{default-data-table-content-body data-table=data-table}}`);

    assert.equal(find('*').textContent.trim(), '');

    // Template block usage:
    await render(hbs`
      {{#default-data-table-content-body data-table=data-table}}
        template block text
      {{/default-data-table-content-body}}
    `);

    assert.equal(find('*').textContent.trim(), 'template block text');
  });
});
