import { helper } from '@ember/component/helper';

import get from '../utils/get';

// todo: change to normal function helper, instead of separate function, in ember 4
export function includesBy(array, obj, byPath) {
    const valueByPath = get(obj, byPath);

    return !!array.find(a => get(a, byPath) === valueByPath);
}

export default helper(function includesByHelper([array, obj, byPath]) {
  return includesBy(array, obj, byPath);
});
