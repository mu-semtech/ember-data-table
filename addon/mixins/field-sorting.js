import Ember from 'ember';

export default Ember.Mixin.create({
  _inverseSort(sort) {
    if (sort.substring(0, 1) === '-') {
      return sort.substring(1);
    } else {
      return "-" + sort;
    }
  },
  
  actions: {
    changeSort(field) {
      if (this.get('current') === field || this.get('current') === this._inverseSort(field)) {
        return this.set('current', this._inverseSort(this.get('current')));
      } else {
        return this.set('current', field);
      }
    }
  }
});
