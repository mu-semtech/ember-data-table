import { helper } from '@ember/component/helper';

export default helper(function lastItemHelper([array]) {
  return array.slice(-1).pop();
});
