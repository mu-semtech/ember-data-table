 
import Store from 'ember-data/store';

export default class StoreService extends Store {
  async query(modelName) {
    if (modelName === 'person') {
      await new Promise(r => setTimeout(r, 300));
    }

    return super.query(...arguments);
  }
}
