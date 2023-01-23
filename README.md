# Ember Data Table
[![Build Status](https://travis-ci.org/mu-semtech/ember-data-table.svg?branch=master)](https://travis-ci.org/mu-semtech/ember-data-table)
[![npm version](https://badge.fury.io/js/ember-data-table.svg)](https://badge.fury.io/js/ember-data-table)

Data table for Ember based on a JSONAPI compliant backend.

Have a look at [ember-paper-data-table](https://github.com/mu-semtech/emper-paper-data-table) to get a data table styled with [ember-paper](https://github.com/miguelcobain/ember-paper).

## Getting started
### Installation
If you're using Ember > v3.8
```bash
ember install ember-data-table
```

For Ember < v3.8, use version 1.x of the addon
```bash
ember install ember-data-table@1.2.2
```

### Usage
Include the `DataTableRouteMixin` in the route which model you want to show in the data table. Configure the model name.

```javascript
import Ember from 'ember';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Ember.Route.extend(DataTableRouteMixin, {
  modelName: 'blogpost'
});
```

Next, include the data table in your template:

```hbs
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


### Visualizing your Ember Data with ember-data-table
In this tutorial we show you how to easily render a data table with search, sort and pagination. The [ember-data-table addon](https://www.npmjs.com/package/ember-data-table) provides a component to visualize your Ember Data in a data table according to [Google’s  Material Design specification](https://material.io/guidelines/components/data-tables.html). Have a look at the [demo](https://ember-data-table.semte.ch) to get an idea of its capabilites. The addon assumes a [JSON:API](http://jsonapi.org/) compliant backend, like mu.semte.ch. It has support for sorting, search and pagination. However, the actual sorting, search and pagination is done by the backend.

In this tutorial we will build the data table on [an extension of the books-service from the Getting Started guide](https://github.com/erikap/books-service/tree/ember-data-table-example). We start with a simple data table using a lot of defaults. We we will first create a new Ember app and install `ember-data-table` and its dependencies. Next, we will generate a model and configure the data table. In the next tutorials we will gradually convert this simple data table into a fully customized data table to display our books. If you already want to try on your own, an extensive overview of all the options, components and helpers of the data table can be found [in the reference](#reference).

#### Creating your app

Let’s get started! First, create a new Ember app and install the `ember-data-table` addon and its prerequisites.

```bash
ember new my-ember-app
cd my-ember-app
ember install ember-cli-sass
ember install ember-cli-materialize
ember install ember-data-table
```

The installation process will first install the `ember-data-table` package. Next, it will overwrite `app.scss` and the `ApplicationSerializer`. The `app.scss` imports the data table styling, while the changes in the `ApplicationSerializer` will automatically parse the pagination metadata from the JSONAPI responses. You don’t have to know the technical details of the serializer to use the addon, but if you’re interested, have a look at the [DataTableSerializerMixin](https://github.com/mu-semtech/ember-data-table/blob/master/addon/mixins/serializer.js) which is included in the `ApplicationSerializer`.

#### Generating a model and a route

Now the addon is installed, we can include our first data table. We will first generate a model for a book and an author:

```bash
ember generate model book title isbn publicationDate:date genre language numberOfPages:number authors:hasMany
ember generate model author name books:hasMany
```

Next, generate a new route `/books` to show our table.

```bash
ember generate route books
```


#### Configuring the data table
Include the [DataTableRouteMixin](https://github.com/mu-semtech/ember-data-table/blob/master/addon/mixins/route.js) in `app/routes/books.js` and set the model name:

```js
import Ember from 'ember';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default Ember.Route.extend(DataTableRouteMixin, {
   modelName: 'book'
});
```

Finally, add the data-table in your template `app/templates/book.hbs`:
```hbs
<h1>My books</h1>
{{data-table content=model fields="title isbn"}}
```

#### Adding sorting and pagination

By including the `DataTableRouteMixin` in the `/books` route, we get sorting and pagination for free (if your back-end supports it of course). Just pass the ‘page’ and ‘sort’ parameters to the data table. The `DataTableRouteMixin` will make sure the model gets refreshed when one of the parameters is updated.

```hbs
<h1>My books</h1>
{{data-table content=model 
    fields="title isbn genre publicationDate language numberOfPages" 
    page=page sort=sort}}
```

#### Adding free-text search
Finally, we will include a free-text search field. The only thing we need to do to enable this is passing the filter parameter to the data-table and initializing it on an empty string in the controller.

Generate a controller for the `/books` route.

```bash
ember generate controller books
```

Initialize the filter query param by including the [DefaultParamsMixin](https://github.com/mu-semtech/ember-data-table/blob/master/addon/mixins/default-query-params.js).

```js
import Ember from 'ember';
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';

export default Ember.Controller.extend(DefaultQueryParamsMixin, {
});
```

Update the `books.hbs` template with the filter paramater.

```hbs
<h1>My books</h1>
{{data-table content=model 
    fields="title isbn genre publicationDate language numberOfPages" 
    page=page sort=sort filter=filter}}
```

That’s it. We now have a simple data table including sorting, pagination and free-text search with minimal effort. In the [following part of the tutorial below](#tailoring-ember-data-table-to-your-app) we will customize the formatting of the columns and add some custom action buttons in the table header.

*This tutorial has been adapted from Erika Pauwels' mu.semte.ch article. You can view it [here](https://mu.semte.ch/2017/03/02/visualizing-your-ember-data-with-ember-data-table/).*


### Tailoring ember-data-table to your app
This tutorial is a follow-up [on how to visualize your Ember Data with the ember-data-table](#visualizing-your-ember-data-with-ember-data-table). Have a look at the first tutorial if you want to get started with the ember-data-table addon. This article explains how to customize the data table by defining custom table headers and column formatting. We will continue on [the books example](https://github.com/erikap/ember-data-table-demo) of the previous post. A live demo is available on [https://ember-data-table.semte.ch](https://ember-data-table.semte.ch).

![](http://mu.semte.ch/wp-content/uploads/2017/03/ember-data-table-screenshot-1024x332.png)



In the previous tutorial we created a simple data table to list the books in our library. We used the default header and column rendering resulting in table headers  like ‘publicationDate’ and ‘nbOfPages’ and non-formatted data in the columns such as ‘Wed Jan 01 1913 01:00:00 GMT+0100 (CET)’. In this tutorial we will first customize the column header. Next, we will format the data and enrich it by showing the author(s) of the books.

#### Customizing the table headers

To customize the data table we will update the template containing the data table component. First, remove the `fields` parameter. Next, convert the component to the [block form](https://guides.emberjs.com/v2.12.0/components/wrapping-content-in-a-component/) so that we can provide custom HTML content.

```hbs
{{#data-table content=model page=page sort=sort filter=filter}}
    <!-- our custom content here -->
{{/data-table}}
```

We can now define our custom headers using [contextual components](https://guides.emberjs.com/v2.12.0/components/wrapping-content-in-a-component/#toc_sharing-component-data-with-its-wrapped-content) wrapping inner components within the context of outer components. Add the table context as variable ‘t’ and define a ‘content’ block component. Next to the content block, the data table can also have a menu block containing custom action buttons. We will elaborate on this [below](#adding-actions-to-the-data-table).

```hbs
{{#data-table content=model page=page sort=sort filter=filter as |t|}}
  {{#t.content}}
    <!-- our custom content here -->
  {{/t.content}}
{{/data-table}}
```

The content component wraps two components itself: a header component and a body component. The names are self-explanatory. The header component contains the column headers. The body component contains the actual data – the body – of the data table.

Let’s start with the header. Add the content as a context variable on the content component and wrap the header component in it.

```hbs
{{#data-table content=model page=page sort=sort filter=filter as |t|}}
  {{#t.content as |c|}}
    {{#c.header}}
        <!-- our custom headers here -->
    {{/c.header}}
  {{/t.content}}
{{/data-table}}
```

Define your custom HTML content to display the table headers in the data table. In its simplest form the headers could just be `<th>` table headers containing a custom label:

```hbs
{{#c.header}}
    <th>Title</th>
    <th>Author</th>
    <th>ISBN</th>
    <th>Genre</th>
    <th>Published</th>
    <th>Language</th>
    <th># pages</th>
{{/c.header}}
```

If you want the column to be sortable, you can use the `th-sortable` component provided by the addon. This component will automatically display the table header with the appropriate sort icons depending on the current sorting. Just pass the field (model attribute), label and current sorting to the component.

```hbs
{{th-sortable field='title' currentSorting=sort label='Title'}}
```

The header may consist of a mix of sortable and non-sortable table headers, for example resulting in:

```hbs
{{#data-table content=model page=page sort=sort filter=filter as |t|}}
  {{#t.content as |c|}}
    {{#c.header}}
        {{th-sortable field='title' currentSorting=sort label='Title'}}
        <th>Author</th>
        {{th-sortable field='isbn' currentSorting=sort label='ISBN'}}
        {{th-sortable field='genre' currentSorting=sort label='Genre'}}
        {{th-sortable field='publicationDate' currentSorting=sort label='Published'}}
        {{th-sortable field='language' currentSorting=sort label='Language'}}
        <th># pages</th>
    {{/c.header}}
  {{/t.content}}
{{/data-table}}
```

#### Formatting the table columns
Similar to the header component, we can include a body component in the table’s content block.  The row context is passed as a variable ‘row’.

```hbs
{{#data-table content=model page=page sort=sort filter=filter as |t|}}
  {{#t.content as |c|}}
    {{#c.header}}
        ...
    {{/c.header}}
    {{#c.body as |row|}}
        <!-- our custom body here -->
    {{/c.body}}
  {{/t.content}}
{{/data-table}}
```

The ‘row’ variable contains the Ember Data record to be displayed. Displaying an attribute or relationship works as you would expect:
```hbs
{{row.title}}
{{row.authors}}
```

The custom HTML content defined in the body component are wrapped in a `<tr>` tag. We just need to define the `<td>` tags, one per column. The content of the `<td>` tags may include any valid HTML, including other components like for example ‘[moment-format](https://github.com/stefanpenner/ember-moment)‘ to format a date or the [join composable helper](https://github.com/DockYard/ember-composable-helpers#join) to display an array of values.
```hbs
{{#c.body as |row|}}
  <td>{{row.title}}</td>
  <td>{{join ", " (map-by "name" row.authors)}}</td>
  <td><a href="https://www.google.be/#q=isbn:+{{row.isbn}}&\*">{{row.isbn}}</a></td>
  <td>{{row.genre}}</td>
  <td>{{moment-format row.publicationDate 'MM/DD/YYYY'}}</td>
  <td>{{row.language}}</td>
  <td>{{row.numberOfPages}}</td>
{{/c.body}}
```

#### Adding custom actions on top of the data table
![](http://mu.semte.ch/wp-content/uploads/2017/05/ember-data-table-custom-actions.png)

The addition of actions on top of the data table works similar to the customisation of the data table contents using [contextual components](https://guides.emberjs.com/v2.12.0/components/wrapping-content-in-a-component/#toc_sharing-component-data-with-its-wrapped-content). We will start from a data table component in block form containing a custom ‘content’ block:
```hbs
{{#data-table content=model page=page sort=sort filter=filter as |t|}}
  {{#t.content}}
    <!-- our custom content here -->
  {{/t.content}}
{{/data-table}}
```

Add a ‘menu’ block next to the ‘content block’ inside the data table component. The menu block on its turn consists of two blocks:  a ‘general’ and a ‘selected’ block. The ‘general’ block is shown by default. The ‘selected’ block is shown when one or more rows in the data table are selected. It typically contains actions that will be executed only on the selected items.

```hbs
{{#data-table content=model page=page sort=sort filter=filter as |t|}}
  {{#t.menu as |menu|}}
    {{#menu.general}}
      <!-- general menu items here --> 
    {{/menu.general}}
    {{#menu.selected as |selection datatable|}}
      <!-- selected menu items here --> 
    {{/menu.selected}}
  {{/t.menu}}
  {{#t.content}}
    <!-- our custom content here -->
  {{/t.content}}
{{/data-table}}
```
Next, add the menu items as anchor elements to the ‘general’ and ‘selected’ blocks. Each anchor element contains an [Ember action helper](https://guides.emberjs.com/v2.13.0/templates/actions/) that will execute the appropriate action. The actions in the ‘selected’ menu block receive the selected rows and the data table as parameters.

```hbs
{{#data-table content=model page=page sort=sort filter=filter as |t|}}
  {{#t.menu as |menu|}}
    {{#menu.general}}
      <a {{action 'export'}}>Export</a>
      <a {{action 'print'}}>Print</a>
    {{/menu.general}}
    {{#menu.selected as |selection datatable|}}
      <a {{action 'delete' selection datatable}}>Delete</a>
    {{/menu.selected}}
  {{/t.menu}}
  {{#t.content}}
    <!-- our custom content here -->
  {{/t.content}}
{{/data-table}}
```
If you would render the data table now, you will see the ‘general’ menu on top of the data table. As soon as you start selecting rows, the ‘selected’ menu will be shown. This menu automatically contains a ‘Cancel’ button to clear the selection without executing an action.

Finally, we need to implement the menu actions in the controller. In the example above we defined three actions: ‘export’  and ‘print’ in the general menu and ‘delete’ in the selected menu. Since the ‘delete’ action receives the selected rows and the data table as parameters, the action method signatures in the controller will look as follows:
```js
actions: {
  export() {
    // implement export action here
  },
  print() {
    // implement print action here
  },
  delete(selection, datatable) {
     // implement delete action here
     // e.g. selection.forEach(function(item) { item.destroyRecord(); });

     // clear the selection at the end
    datatable.clearSelection();
  }
}
```

You can now implement the actions in any way you want. Just note that in the actions of the ‘selected’ menu you need to clear the selection by yourself in the end by calling `datatable.clearSelection()` as shown in the example above.

This concludes this tutorial. Have look at the [reference](#reference) to get an extensive overview of all the options, components and helpers of the data table. We hope you’re convinced on the easy-of-use of this addon by following the tutorials. Feel free to make a [contribution](https://github.com/mu-semtech/ember-data-table) or log an [issue](https://github.com/mu-semtech/ember-data-table) if you have a problem using the ember-data-table.

*This tutorial has been adapted from Erika Pauwels' mu.semte.ch articles. You can view them [here](https://mu.semte.ch/2017/03/30/tailoring-ember-data-table-to-your-app/) and [here](https://mu.semte.ch/2017/05/18/tailoring-ember-data-table-to-your-app-part-2/).*

## Reference
### Data table component

#### Specification

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

#### Customizing the data table
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

#### Adding actions to the data table
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

### Helper components
The following components may be helpful when customizing the data table:
* [Sortable header](https://github.com/mu-semtech/ember-data-table#sortable-header)

#### Sortable header
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

### Mixins
The following mixins may be helpful to use with the data table:
* [Serializer mixin](https://github.com/mu-semtech/ember-data-table#serializer)
* [Route mixin](https://github.com/mu-semtech/ember-data-table#route)
* [Default Query Params mixin](https://github.com/mu-semtech/ember-data-table#default-query-params)

#### Serializer
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

#### Route
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

#### Default Query Params
The `DefaultQueryParams` mixin provides sensible defaults for the `page` (default: 0), `size` (default: 25) and `filter` (default: '') query parameters. The mixin can be mixed in a controller that uses the `page` and `filter` query params.

```javascript
import Ember from 'ember';
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';

export default Ember.Controller.extend(DefaultQueryParamsMixin, {
  ...
});
```

Note: if you want the search text field to be enabled on a data table, the filter parameter may not be `undefined`. Therefore you must initialize it on an empty query string (as done by the `DefaultQueryParams` mixin).
