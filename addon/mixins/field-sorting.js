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
      if (this.get('sort') === field || this.get('sort') === this._inverseSort(field)) {
        return this.set('sort', this._inverseSort(this.get('sort')));
      } else {
        return this.set('sort', field);
      }
    }
  }
});
