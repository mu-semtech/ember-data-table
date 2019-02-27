import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, findAll } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | data table', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('content', []);
    this.set('content.meta', {
      pagination: {
        first: { number: 1 },
        last: { number: 10 }
      }
    });

    await render(hbs`{{data-table content=content enableSizes=false}}`);

    assert.equal(findAll('.data-table-content').length, 1);

  });
});
