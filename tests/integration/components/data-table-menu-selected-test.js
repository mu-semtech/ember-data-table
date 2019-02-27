import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | data table menu selected', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders block only if data table selection is not empty', async function(assert) {
    this.set('data-table', { selectionIsEmpty: true });
    // Template block usage:
    await render(hbs`
      {{#data-table-menu-selected data-table=data-table}}
        template block text
      {{/data-table-menu-selected}}
    `);
    assert.equal(find('*').textContent.trim(), '');
  });

  test('it renders selection count', async function(assert) {
    this.set('data-table', { selectionIsEmpty: false, selection: ['foo'] });
    // Template block usage:
    await render(hbs`
      {{#data-table-menu-selected data-table=data-table}}
        template block text
      {{/data-table-menu-selected}}
    `);

    assert.equal(find('span.item-count').textContent.trim(), '1 item(s) selected', 'item count 1');

    this.set('data-table', { selectionIsEmpty: false, selection: ['foo', 'bar'] });
    // Template block usage:
    await render(hbs`
      {{#data-table-menu-selected data-table=data-table}}
        template block text
      {{/data-table-menu-selected}}
    `);

    assert.equal(find('span.item-count').textContent.trim(), '2 item(s) selected', 'item count 2');
  });

  test('calls clearSelection on cancel button click', async function(assert) {
    assert.expect(2); // 2 asserts in this test

    this.set('data-table', { selectionIsEmpty: false, selection: ['foo']});
    this.set('data-table.clearSelection', function() {
      assert.ok(true, 'data-table.clearSelection gets called');
    });
    // Template block usage:
    await render(hbs`
      {{#data-table-menu-selected data-table=data-table}}
        template block text
      {{/data-table-menu-selected}}
    `);

    assert.equal(find('button').textContent.trim(), 'Cancel', 'renders a cancel button');
    await click('button');
  });
});
