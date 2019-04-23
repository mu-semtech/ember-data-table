# Ember Data Table
[![Build Status](https://travis-ci.org/mu-semtech/ember-data-table.svg?branch=master)](https://travis-ci.org/mu-semtech/ember-data-table)
[![npm version](https://badge.fury.io/js/ember-data-table.svg)](https://badge.fury.io/js/ember-data-table)

Data table for Ember based on a JSONAPI compliant backend.

Have a look at [ember-paper-data-table](https://github.com/mu-semtech/emper-paper-data-table) to get a data table styled with [ember-paper](https://github.com/miguelcobain/ember-paper).

## Installation
```bash
ember install ember-data-table
```

## Getting started
Include the `DataTableRouteMixin` in the route which model you want to show in the data table. Configure the model name.

```javascript
import Ember from 'ember';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Ember.Route.extend(DataTableRouteMixin, {
  modelName: 'blogpost'
});
```

Next, include the data table in your template:

```htmlbars
{{data-table
  content=model
  fields="firstName lastName age created modified"
  isLoading=isLoadingModel
  filter=filter
  sort=sort
  page=page
  size=size
}}
```

Note: the filtering, sorting and pagination isn't done at the frontend. By including the `DataTableRouteMixin` in the route each change to the `filter`, `sort`, `page` and `size` params will result in a new request to the backend. The `DataTableRouteMixin` also sets an isLoadingModel flag while the route's model is being loaded.

Have a look at [Customizing the data table](https://github.com/erikap/ember-data-table#customizing-the-data-table) to learn how you can customize the data table's header and body.

## Data table component

### Specification

The following parameters can be passed to the data-table component:

| Parameter | Required | Default | Description |
|-----------|----------|---------|-------------|
| content | x | | a list of resources to be displayed in the table |
| fields | | | names of the model fields to show as columns (seperated by whitespace) |
| isLoading | | false | shows a spinner instead of the table content if true |
| filter | | | current value of the text search |
| sort | | | field by which the data is currently sorted |
| page | | | number of the page that is currently displayed |
| size | | | number of items shown on one page |
| enableSizes | | true | flag to enable page size options dropdown |
| sizes | | [5, 10, 25, 50, 100] | array of page size options (numbers) |
| link | | | name of the route the first column will link to. The selected row will be passed as a parameter. |
| onClickRow | | | action sent when a row is clicked. Takes the clicked item as a parameter. |
| autoSearch | | true | whether filter value is updated automatically while typing (with a debounce) or user must click a search button explicitly to set the filter value.
| noDataMessage | | No data | message to be shown when there is no content |
| lineNumbers | | false | display a line number per table row (default: false). Must be true or false. |
| searchDebounceTime | | 2000 | debounce time of the search action of the data table. Must be integer. |

By default the data table will make each column sortable. The search text box is only shown if the `filter` parameter is bound. Pagination is only shown if the pagination metadata is set on the model (see the [Ember Data Table Serializer mixin](https://github.com/mu-semtech/ember-data-table#serializer)).

### Customizing the data table
The way the data is shown in the table can be customized by defining a `content` block instead of a `fields` parameter.

```htmlbars
{{#data-table content=model filter=filter sort=sort page=page size=size onClickRow=(action "clickRow") as |t|}}
  {{#t.content as |c|}}
    {{#c.header}}
      {{th-sortable field='firstName' currentSorting=sort label='First name'}}
      {{th-sortable field='lastName' currentSorting=sort label='Last name'}}
      <th>Age</th>
      {{th-sortable field='created' currentSorting=sort label='Created'}}
      <th>Modified</th>
    {{/c.header}}
    {{#c.body as |row|}}
      <td>{{row.firstName}}</td>
      <td>{{row.lastName}}</td>
      <td>{{row.age}}</td>
      <td>{{moment-format row.created}}</td>
      <td>{{moment-format row.modified}}</td>
    {{/c.body}}
  {{/t.content}}
{{/data-table}}
```
Have a look at the [helper components](https://github.com/mu-semtech/ember-data-table#helper-components).

### Adding actions to the data table
The user can add actions on top of the data table by providing a `menu` block.
```htmlbars
{{#data-table content=model filter=filter sort=sort page=page size=size isLoading=isLoadingModel as |t|}}
  {{#t.menu as |menu|}}
    {{#menu.general}}
      {{#paper-button onClick=(action "export") accent=true noInk=true}}Export{{/paper-button}}
      {{#paper-button onClick=(action "print") accent=true noInk=true}}Print{{/paper-button}}          
    {{/menu.general}}
    {{#menu.selected as |selection datatable|}}
      {{#paper-button onClick=(action "delete" selection table) accent=true noInk=true}}Delete{{/paper-button}}
    {{/menu.selected}}
  {{/t.menu}}
  {{#t.content as |c|}}
    ...
  {{/t.content}}
{{/data-table}}
```
The menu block consists of a `general` and a `selected` block. The `menu.general` is shown by default. The `menu.selected` is shown when one or more rows in the data table are selected.

When applying an action on a selection, the currently selected rows can be provided to the action by the `selection` parameter. The user must reset the selection by calling `clearSelection()` on the data table.
E.g.
```javascript
actions:
  myAction(selection, datatable) {
    console.log("Hi, you reached my action for selection: " + JSON.stringify(selection));
    datatable.clearSelection();
  }    
```

## Helper components
The following components may be helpful when customizing the data table:
* [Sortable header](https://github.com/mu-semtech/ember-data-table#sortable-header)

### Sortable header
The `th-sortable` component makes a column in the data table sortable. It displays a table header `<th>` element including an ascending/descending sorting icon in case the table is currently sorted by the given column.

```htmlbars
{{th-sortable field='firstName' currentSorting=sort label='First name'}}
```

The following parameters are passed to the `th-sortable` component:

| Parameter | Required | Description |
|-----------|----------|-------------|
| field | x | name of the model field in the column |
| label | x | label to be shown in the column's table header |
| currentSorting | x | current sorting (field and order) of the data according to [the JSONAPI specification](http://jsonapi.org/format/#fetching-sorting) |

Note: the data table will update the `currentSorting` variable, but the user needs to handle the reloading of the data. The [Ember Data Table Route mixin](https://github.com/mu-semtech/ember-data-table#route) may be of use.

## Mixins
The following mixins may be helpful to use with the data table:
* [Serializer mixin](https://github.com/mu-semtech/ember-data-table#serializer)
* [Route mixin](https://github.com/mu-semtech/ember-data-table#route)
* [Default Query Params mixin](https://github.com/mu-semtech/ember-data-table#default-query-params)

### Serializer
Upon installation, the `DataTableSerializerMixin` is automatically included in your application serializer to add parsing of the filter, sortig and pagination meta data from the links in the [JSONAPI](http://jsonapi.org) responses. The data is stored in [Ember's model metadata](https://guides.emberjs.com/v2.9.0/models/handling-metadata/).

To include the `DataTableSerializerMixin` in your application, add the mixin to your application serializer:
```javascript
import DS from 'ember-data';
import DataTableSerializerMixin from 'ember-data-table/mixins/serializer';

export default DS.JSONAPISerializer.extend(DataTableSerializerMixin, {

});
```

E.g.
```javascript
meta: {
  count: 42
},
links: {
  previous: '/posts?page[number]=1&page[size]=10'
  next: '/posts?page[number]=3&page[size]=10'
}
```
will be parsed to
```javascript
meta: {
  count: 42,
  pagination: {
    previous: { number: 1, size: 10 },
    next: { number: 3, size: 10 }
  }
}
```

### Route
The route providing data for the `data-table` component often looks similar. The model hook needs to query a list of resources of a specific model from the server. This list needs to be reloaded when the sorting, page or page size changes. The `DataTableRouteMixin` provides a default implementation of this behaviour. Just include the mixin in your route and specify the model to be queried as `modelName`.

```javascript
import Ember from 'ember';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Ember.Route.extend(DataTableRouteMixin, {
  modelName: 'post'
});
```

The `DataTableRouteMixin` specifies the `filter`, `page`, `sort` and `size` variables as `queryParams` of the route with the `refreshModel` flag set to `true`. As such the data is reloaded when one of the variables changes. A user can add custom options to be passed in the query to the server by defining a `mergeQueryOptions(parms)` function in the route. The function must return an object with the options to be merged.

```javascript
import Ember from 'ember';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Ember.Route.extend(DataTableRouteMixin, {
  modelName: 'post',
  mergeQueryOptions(params) {
    return { included: 'author' };
  }
});
```

Note: if the `mergeQueryOptions` returns a filter option on a specific field (e.g. `title`), the nested key needs to be provided as a string. Otherwise the `filter` param across all fields will be overwritten breaking the general search.

E.g.
```javascript
mergeQueryOptions(params) {
    return {
        included: 'author',
        'filter[title]': params.title
    };
}
```

The `DataTableRouteMixin` also sets the `isLoadingModel` flag on the controller while the route's model is being loaded. Passing this flag to the data table's `isLoading` property will show a spinner while data is loaded.

### Default Query Params
The `DefaultQueryParams` mixin provides sensible defaults for the `page` (default: 0), `size` (default: 25) and `filter` (default: '') query parameters. The mixin can be mixed in a controller that uses the `page` and `filter` query params.

```javascript
import Ember from 'ember';
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';

export default Ember.Controller.extend(DefaultQueryParamsMixin, {
  ...
});
```

Note: if you want the search text field to be enabled on a data table, the filter parameter may not be `undefined`. Therefore you must initialize it on an empty query string (as done by the `DefaultQueryParams` mixin).
