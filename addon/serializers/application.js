import DS from 'ember-data';

export default DS.JSONAPISerializer.extend({

  /** 
      Parse the links in the JSONAPI response and convert to a meta-object 
  */
  normalizeQueryResponse(store, clazz, payload) {
    const result = this._super(...arguments);
    result.meta = result.meta || {};

    if (payload.links) {
      result.meta.pagination = this.createPageMeta(payload.links);
    }

    return result;
  },

  /**
     Transforms link URLs to objects containing metadata
     E.g. 
     links: { 
         previous: '/streets?page[number]=1&page[size]=10 
         next: '/streets?page[number]=3&page[size]=10 
     }

     will be converted to 

     meta: { 
         previous: { number: 1, size: 10 },
         next: { number: 3, size: 10 } 
     }
   */
  createPageMeta(data) {
    let meta = {};

    Object.keys(data).forEach(type => {
      const link = data[type];
      meta[type] = {};
      let a = document.createElement('a');
      a.href = link;

      a.search.slice(1).split('&').forEach(pairs => {
        const [param, value] = pairs.split('=');

        if (param === 'page[number]') {
          meta[type].number = parseInt(value);
        }
        if (param === 'page[size]') {
          meta[type].size = parseInt(value);
        }

      });
      a = null;
    });

    return meta;
  }
  
});

