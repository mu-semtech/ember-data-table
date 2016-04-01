import Ember from 'ember';

export function sortIcon(params/*, hash*/) {
  var [field,sort] = params;
  if (sort === field) {
    return "arrow_downward";
  } else if (sort === `-${field}`) {
    return "arrow_upward";
  } else {
    return "";
  }
}

export default Ember.Helper.helper(sortIcon);
