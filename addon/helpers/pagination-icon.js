import Ember from 'ember';

export function paginationIcon(params/*, hash*/) {
  var icon;
  icon = '';
  switch (params[0]) {
    case 'first':
      icon = 'first_page';
      break;
    case 'prev':
      icon = 'chevron_left';
      break;
    case 'next':
      icon = 'chevron_right';
      break;
    case 'last':
      icon = 'last_page';
      break;
    default:
      icon = '';
  }
  return icon;
}

export default Ember.Helper.helper(paginationIcon);
