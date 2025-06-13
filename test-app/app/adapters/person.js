import { inject as service } from '@ember/service';
import Adapter from '@ember-data/adapter';

export default class LocalAdapter extends Adapter {
  @service createData;

  async query(store, type, query) {
    return this.createData.queryPeople(query);
  }
}
