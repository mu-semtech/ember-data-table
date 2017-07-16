import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('number-pagination', 'Integration | Component | number pagination', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.set('page', 0);
  this.set('links', {
    first: { number: 1 },
    last: { number: 10 }
  });
  this.render(hbs`{{number-pagination page=page links=links}}`);

  assert.equal(this.$('.data-table-pagination').length, 1);
});
