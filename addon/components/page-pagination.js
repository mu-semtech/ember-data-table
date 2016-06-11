import Ember from 'ember';
import layout from '../templates/components/page-pagination';

export default Ember.Component.extend({
  layout: layout,
  keys: ['first', 'prev', 'next', 'last'],
  sortedLinks: Ember.computed('keys', 'links', function() {
    var result = {};
    this.get('keys').map( (key) => {
      result[key] = this.get('links')[key];
    });
    if (!this.get('links.prev')) { result['first'] = undefined; }
    if (!this.get('links.next')) { result['last'] = undefined; }
    return result;
  }),
  actions: {
    changePage(link) {
      this.set('page', link['number'] || 0);
      if (link['size']) { this.set('size', link['size']); }
    }
  }
});
