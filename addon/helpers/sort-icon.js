import Ember from 'ember';

export function sortIcon(params/*, hash*/) {
  var order = params[0];
  if (order === 'asc') {
    return "arrow_downward";
  } else if (order === 'desc') {
    return "arrow_upward";
  } else {
    return "";
  }
}

export default Ember.Helper.helper(sortIcon);
