import Ember from 'ember';
import EmberObject from '@ember/object';
import ArrayProxy from '@ember/array/proxy';
import Controller from '@ember/controller';
import DefaultQueryParams from 'ember-data-table/mixins/default-query-params';

var ApplicationController = Controller.extend(DefaultQueryParams, {
  model: ArrayProxy.create({
    content: [
      EmberObject.create({ firstName: 'John', lastName: 'Doe', age: 20, created: Date.now(), modified: Date.now() }),
      EmberObject.create({ firstName: 'Jane', lastName: 'Doe', age: 25, created: Date.now(), modified: Date.now() })
    ],
    meta: {
      count: 63,
      pagination: {
        first: {
          number: 0,
          size: 5
        },
        prev: {
          number: 1,
          size: 5
        },
        self: {
          number: 2,
          size: 5
        },
        next: {
          number: 3,
          size: 5
        },
        last: {
          number: 12,
          size: 5
        }
      }
    }
  }),
  page: 2,
  size: 5,
  sort: 'first-name',
  actions: {
    test(row) {
      Ember.Logger.info("Hi, you reached the test action for row: " + JSON.stringify(row));
    },
    menuTest() {
      Ember.Logger.info("Hi, you reached the general menu test action");
    },
    selectionTest(selection, datatable) {
      datatable.clearSelection();
      Ember.Logger.info("Hi, you reached the selection test action for selection: " + JSON.stringify(selection));
      selection.forEach(function(item) {
        item.set('age', item.get('age') + 1);
      });
    },
    clickRow(row) {
      Ember.Logger.info("Custom row click action on item " + JSON.stringify(row));
    }
  }
});

export default ApplicationController;
