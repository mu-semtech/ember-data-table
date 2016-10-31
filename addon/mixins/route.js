import Ember from 'ember';

export default Ember.Mixin.create({
  queryParams: {
    page: { refreshModel: true },
    sort: { refreshModel: true },
    size: { refreshModel: true }
  },
  model( params ) {
    const options = {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size
      } };
    return this.store.query( this.get('modelName'), options );
  }
});
