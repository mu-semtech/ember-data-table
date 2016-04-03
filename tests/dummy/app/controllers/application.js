import Ember from 'ember';

var ApplicationController = Ember.Controller.extend({
  rows: Ember.ArrayProxy.create({
    content: [
      Ember.Object.create({ firstName: 'John', lastname: 'Doe', age: 20, created: Date.now(), modified: Date.now() }),
      Ember.Object.create({ firstName: 'Jane', lastname: 'Doe', age: 25, created: Date.now(), modified: Date.now() })
    ]
  }),
  columns: [
    { field: 'firstName', label: 'First name', sortable: true },
    { field: 'lastName', label: 'Last name', sortable: true },
    { field: 'age', label: 'Age' },
    { field: 'created', label: 'Created', sortable: true, isDate: true },
    { field: 'modified', label: 'Modified', sortable: true, isDate: true }
  ],
  headerMenu: [
    { action: 'print', label: 'Print' }
  ],
  selectionMenu: [
    { action: 'print', label: 'Print selection' }
  ],
  contextMenu: [
    { action: 'print', label: 'Detail' }
  ],
  sort: 'firstName',
  actions:
    {print() {
      console.log("I'm in the print action");
    }
    }
});

export default ApplicationController;
