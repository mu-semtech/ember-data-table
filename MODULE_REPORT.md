## Module Report
### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/dummy/app/controllers/application.js` at line 44

```js
  actions: {
    test(row) {
      Ember.Logger.info("Hi, you reached the test action for row: " + JSON.stringify(row));
    },
    menuTest() {
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/dummy/app/controllers/application.js` at line 47

```js
    },
    menuTest() {
      Ember.Logger.info("Hi, you reached the general menu test action");
    },
    selectionTest(selection, datatable) {
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/dummy/app/controllers/application.js` at line 51

```js
    selectionTest(selection, datatable) {
      datatable.clearSelection();
      Ember.Logger.info("Hi, you reached the selection test action for selection: " + JSON.stringify(selection));
      selection.forEach(function(item) {
        item.set('age', item.get('age') + 1);
```

### Unknown Global

**Global**: `Ember.Logger`

**Location**: `tests/dummy/app/controllers/application.js` at line 57

```js
    },
    clickRow(row) {
      Ember.Logger.info("Custom row click action on item " + JSON.stringify(row));
    }
  }
```
