import JSONAPISerializer from '@ember-data/serializer/json-api';

/**
 * Transforms link URLs to objects containing metadata
 * E.g.
 * {
 *     previous: '/streets?page[number]=1&page[size]=10&sort=name
 *     next: '/streets?page[number]=3&page[size]=10&sort=name
 * }
 * will be converted to
 * {
 *     previous: { number: 1, size: 10 },
 *     next: { number: 3, size: 10 }
 * }
 */
function createPageMeta(data) {
  let meta = {};

  Object.keys(data).forEach((type) => {
    const link = data[type];
    meta[type] = {};

    if (link) {
      //extracts from '/path?foo=bar&baz=foo' the string: foo=bar&baz=foo
      const query = link.split(/\?(.+)/)[1] || '';

      query.split('&').forEach((pairs) => {
        const [param, value] = pairs.split('=');

        if (decodeURIComponent(param) === 'page[number]') {
          meta[type].number = parseInt(value);
        } else if (decodeURIComponent(param) === 'page[size]') {
          meta[type].size = parseInt(value);
        }
      });
    }
  });

  return meta;
}


/**
 * Adds the meta content to the query result.
 *
 * This function can be used if you need to manually append the changes.
 * For instance, if you also have other overrides in the serializer.
 *
 * @param result The result from normalizeQueryResponse.
 * @param payload The payload supplied to normalizeQueryResponse.
 * @return The manipulated result object.
 */
export function appendMetaToQueryResponse(result, payload) {
  result.meta = result.meta || {};

  if (payload.links) {
    result.meta.pagination = createPageMeta(payload.links);
  }
  if (payload.meta) {
    result.meta.count = payload.meta.count;
  }

  return result;
}

/**
 * Decorator for the normalizeQueryResponse serializer method.
 *
 * Augments the call to the normalizeQueryResponse method with parsing
 * of the payload to extract the page meta.  This decorator can be used
 * if the serializer itself could not be used directly.  Alternatively,
 * you can combine the calls yourself with appendMetaToQueryResponse
 * (also exported from here) directly.
 */
export function withPageMeta(_target, _name, descriptor) {
  const original = descriptor.value;

  descriptor.value = function(_store, _clazz, payload) {
    const result = original.apply(this,arguments);
    return appendMetaToQueryResponse(result, payload);
  };

  return descriptor;
}

/**
 * Serializer to be used for DataTable requests.
 *
 * By extending this, the query repsonses are parsed correctly.  If you
 * need to adapt further, or need to combine with other libraries, also
 * take a peek at the withPageMeta decorator exported from here, as well
 * as the appendMetaToQueryResponse function.
 */
export default class ApplicationSerializer extends JSONAPISerializer {
  /**
    * Parse the links in the JSONAPI response and convert to a meta-object
    */
  @withPageMeta
  normalizeQueryResponse() {
    return super.normalizeQueryResponse(...arguments);
  }
}
