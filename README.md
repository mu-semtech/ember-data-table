# Ember Data Table

Data table for Ember following Google Design specs.

## Installation
```bash
ember install ember-data-table
```

This addon depends on [ember-cli-materialize](https://github.com/mike-north/ember-cli-materialize). It will be automatically installed as a dependency.

## Styling

Upon installation, the ember-data-table style will be automatically included in the app.css:

```javascript
@import 'ember-data-table';
```

## Data table component

The data table component displays a data table according to the [Google Design spec](https://material.google.com/components/data-tables.html). The data table can be fully customized as explained in [Customizing the data table](https://github.com/erikap/ember-data-table#customizing-the-data-table).

To see a demo of the data tables, clone the repository and run the dummy app:
```bash
git clone https://github.com/erikap/ember-data-table.git
cd ember-data-table
ember server
```

### Simple data table
In its simplest form the data table looks like:
```htmlbars
{{data-table
  content=model
  fields="firstName lastName age created modified"
  sort=sort
  page=page
}}
```

The following parameters are passed to the data-table:
* `content`: a list of resources to be displayed in the table
* `field`: names of the model fields to show as columns
* `sort` (optional): field by which the data is currently sorted
* `page` (optional): number of the page that is currently displayed
* `link` (optional): name of the route the first column will link to. The selected row will be passed as a parameter.
* `noDataMessage` (optional): message to be shown when there is no content (default: No data)

By default the data table will make each column sortable. Pagination is only shown if the pagination metadata is set on the model (see the [Ember Data Table Serializer mixin](https://github.com/erikap/ember-data-table#serializer)).

Note: the data table will update the `sort` and `page` variables, but the user needs to handle the reloading of the data. The [Ember Data Table Route mixin](https://github.com/erikap/ember-data-table#route) may be of use.

### Customizing the data table
The way the data is shown in the table can be customized by defining a `content` block instead of a `fields` parameter.

```htmlbars
{{#data-table content=model sort=sort page=page as |t|}}
  {{#t.content as |c|}}
    {{#c.header}}
      {{th-sortable field='firstName' currentSorting=sort label='First name'}}
      {{th-sortable field='lastName' currentSorting=sort label='Last name'}}
      <th>Age</th>
      {{th-sortable field='created' currentSorting=sort label='Created'}}
      <th>Modified</th>
      <th><!-- More menu --></th>
    {{/c.header}}
    {{#c.body as |row|}}
      <td>{{row.firstName}}</td>
      <td>{{row.lastName}}</td>
      <td>{{row.age}}</td>
      <td>{{moment-format row.created}}</td>
      <td>{{moment-format row.modified}}</td>
      <td>
        {{#more-menu}}
          <a class="collection-item" {{action 'showDetails' row}}>Details</a>
          <a class="collection-item" {{action 'edit' row}}>Edit</a>
        {{/more-menu}}
      </td>
    {{/c.body}}
  {{/t.content}}
{{/data-table}}
```
Have a look at the [helper components](https://github.com/erikap/ember-data-table#helper-components).

### Adding actions to the data table
The user can add actions on top of the data table by providing a `menu` block.
```htmlbars
{{#data-table content=model sort=sort page=page as |t|}}
  {{#t.menu as |menu|}}
    {{#menu.general}}
      <a {{action 'export'}}>Export</a>
      <a>Print</a>
    {{/menu.general}}
    {{#menu.selected as |selection|}}
      <a {{action 'delete' selection}}>Delete</a>
    {{/menu.selected}}
  {{/t.menu}}
  {{#t.content as |c|}}
    ...
  {{/t.content}}
{{/data-table}}
```
The menu block consists of a `general` and a `selected` block. The `menu.general` is shown by default. The `menu.selected` is shown when one or more rows in the data table are selected.

When applying an action on a selection, the currently selected rows can be provided to the action by the `selection` parameter. The user must reset the `selected` flags of the rows by himself.
E.g.
```javascript
actions:
  myAction(selection) {
    selection.setEach('isSelected', false);
    console.log("Hi, you reached my action for selection: " + JSON.stringify(selection));
  }    
```

## Helper components
The following components may be helpful when customizing the data table:
* [More menu](https://github.com/erikap/ember-data-table#more-menu)
* [Sortable header](https://github.com/erikap/ember-data-table#sortable-header)

### More menu
The `more-menu` component displays a [Google's more_vert icon](https://material.io/icons/#ic_more_vert) that opens a dropdown menu when clicked. The menu items are passed as a block. Each item should be decorated with the `collection-item` class.

```htmlbars
{{#more-menu}}
  {{link-to 'posts.edit' row class="collection-item"}}Edit{{/link-to}}
  <a class="collection-item" {{action 'delete' row}}>Delete</a>
{{/more-menu}}
```

### Sortable header
The `th-sortable` component makes a column in the data table sortable. It displays a table header `<th>` element including an ascending/descending sorting icon in case the table is currently sorted by the given column.

```htmlbars
{{th-sortable field='firstName' currentSorting=sort label='First name'}}
```

The following parameters are passed to the `th-sortable` component:
* `field`: name of the model field in the column
* `label`: label to be shown in the column's table header
* `currentSorting`: current sorting (field and order) of the data according to [the JSONAPI specification](http://jsonapi.org/format/#fetching-sorting)

Note: the data table will update the `currentSorting` variable, but the user needs to handle the reloading of the data. The [Ember Data Table Route mixin](https://github.com/erikap/ember-data-table#route) may be of use.

## Mixins
### Serializer
Include the `DataTableSerializerMixin` in your application serializer to add parsing of the pagination meta data from the links in the [JSONAPI](http://jsonapi.org) responses. The data is stored in [Ember's model metadata](https://guides.emberjs.com/v2.9.0/models/handling-metadata/).

To include the `DataTableSerializerMixin` in your application, add the mixin to your application serializer:
```javascript
import DS from 'ember-data';
import DataTableSerializerMixin from 'ember-data-table/mixins/serializer';

export default DS.JSONAPISerializer.extend(DataTableSerializerMixin, {
  
});
```

E.g.
```javascript
links: { 
  previous: '/posts?page[number]=1&page[size]=10'
  next: '/posts?page[number]=3&page[size]=10'
}
```
will be parsed to
```javascript
meta: { 
  previous: { number: 1, size: 10 },
  next: { number: 3, size: 10 } 
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

The `DataTableRouteMixin` specifies the `page`, `sort` and `size` variables as `queryParams` of the route with the `refreshModel` flag set to `true`. As such the data is reloaded when one of the variables changes. A user can add custom options to be passed in the query to the server by defining a `mergedQueryOptions` object in the route. 

```javascript
import Ember from 'ember';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Ember.Route.extend(DataTableRouteMixin, {
  modelName: 'post',
  mergedQueryOptions: {
    included: 'author'
  }
});
```
