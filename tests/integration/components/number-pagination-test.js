import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | number pagination', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.set('page', 0);
    this.set('links', {
      first: { number: 1 },
      last: { number: 10 },
    });
    await render(hbs`{{number-pagination page=this.page links=this.links}}`);

    assert.dom('.data-table-pagination').exists({ count: 1 });
  });
});
