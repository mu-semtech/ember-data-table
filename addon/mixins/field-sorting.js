import Ember from 'ember';

export default Ember.Mixin.create({

  /** 
      Inverses the sorting parameter
      E.g. inverseSorting('title') returns '-title'
           inverseSorting('-title') returns 'title'
  */
  _inverseSorting(sorting) {
    if (sorting.substring(0, 1) === '-') {
      return sorting.substring(1);
    } else {
      return "-" + sorting;
    }
  },
  
  actions: {
    /**
       Sets the current sorting parameter.
       Note: the current sorting parameter may contain another field than the given field.
       In case the given field is currenntly used for sorting, inverse the sorting.
       Else, set the sorting to ascending on the given field.
     */
    inverseSorting(field) {
      if (this.get('currentSorting') === field || this.get('currentSorting') === this._inverseSorting(field)) {
        return this.set('currentSorting', this._inverseSorting(this.get('currentSorting')));
      } else { // if currentSorting is not set to this field
        return this.set('currentSorting', field);
      }
    }
  }
});
