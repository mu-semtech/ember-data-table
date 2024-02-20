import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module(
  'Integration | Component | default data table content body',
  function (hooks) {
    setupRenderingTest(hooks);

    test('it renders', async function (assert) {
      // Set any properties with this.set('myProperty', 'value');
      // Handle any actions with this.on('myAction', function(val) { ... });

      this.set('data-table', {
        parsedFields: ['firstName', 'lastName', 'age'],
      });

      await render(
        hbs`<DefaultDataTableContentBody @data-table={{this.data-table}} />`
      );

      assert.dom().hasText('');

      // Template block usage:
      await render(hbs`
      <DefaultDataTableContentBody @data-table={{this.data-table}}>
        template block text
      </DefaultDataTableContentBody>
    `);
      assert.dom().hasText('template block text');
    });
  }
);
