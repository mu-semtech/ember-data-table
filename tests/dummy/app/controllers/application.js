import Ember from 'ember';
import DefaultQueryParams from 'ember-data-table/mixins/default-query-params';

var ApplicationController = Ember.Controller.extend(DefaultQueryParams, {
  model: Ember.ArrayProxy.create({
    content: [
      Ember.Object.create({ firstName: 'John', lastName: 'Doe', age: 20, created: Date.now(), modified: Date.now() }),
      Ember.Object.create({ firstName: 'Jane', lastName: 'Doe', age: 25, created: Date.now(), modified: Date.now() })
    ],
    meta: {
      pagination: {
        first: {
          number: 0,
          size: 3
        },
        prev: {
          number: 1,
      size: 5
        },
        next: {
          number: 3,
          size: 5
        },
        last: {
          number: 4,
          size: 3
        }
      }
    }
  }),
  sort: 'first-name',
  dateFormat: 'DD/MM/YYYY hh:mm:ss',
  actions: {
    test(row) {
      console.log("Hi, you reached the test action for row: " + JSON.stringify(row));
    },
    menuTest() {
      console.log("Hi, you reached the general menu test action");
    },
    selectionTest(selection) {
      selection.setEach('isSelected', false);
      console.log("Hi, you reached the selection test action for selection: " + JSON.stringify(selection));
    }
  }
});

export default ApplicationController;
