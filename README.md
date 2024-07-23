# Ember Data Table
[![Build Status](https://travis-ci.org/mu-semtech/ember-data-table.svg?branch=master)](https://travis-ci.org/mu-semtech/ember-data-table)
[![npm version](https://badge.fury.io/js/ember-data-table.svg)](https://badge.fury.io/js/ember-data-table)

Data table for EmberJS

## Tutorials

### Add basic Ember Data Table

It is advised to adapt Ember Data Table to your specific design setup or use a variant implemented for your setup.  To check if things are working, you can add the `RawDataTable` to your application.

Let's generate a route for products first:

```bash
ember g route products/index
```

We will assume a model exists with `label` and `price` which we could generate using:

```bash
ember g model product label:string price:number
```

Next we ensure content is fetched from the backend using standard model hooks and query parameters are set up.  Extending from the provided Route and Controller is the shortest form.

For the route stored in `/app/routes/products/index.js` write:

```javascript
import DataTableRoute from 'ember-data-table/route';

export default class ProductsIndexRoute extends DataTableRoute {
  modelName = 'product';
}
```

For the controller stored in `/app/controllers/product/index.js` write:

```javascript
import DataTableController from 'ember-data-table/countroller';

export default class ProductsIndexController extends DataTableController {}
```

These steps would be the same for any Ember Data Table flavour, the following visulizes `RawDataTable`:

```hbs
<RawDataTable
  @content={{model}}
  @fields="label price"
  @isLoading={{this.isLoadingModel}}
  @filter={{this.filter}}
  @sort={{this.sort}}
  @page={{this.page}}
  @size={{this.size}}
  @total={{this.total}}
  @updateFilter={{fn (mut this.filter)}}
  @updateSort={{fn (mut this.sort)}}
  @updatePage={{fn (mut this.page)}}
  @updatePageSize={{fn (mut this.size)}} />
```

Visiting `http://localhost:4200/products` will now show the Raw Data Table.

## How-to guides

### Implementing a new style

It is advised to adapt Ember Data Table to your application or design framework.  Multiple examples exist.  The best approach to build a new style is to copy the file from `ember-data-table/addon/components/raw-data-table.hbs` and adapt it to your needs from top to bottom.

The file is quite daunting, yet much can be left as is.  Only the HTML parts of the file need to be overwritten to suit your needs.  Liberally add wrapping tags and classes and use custom input components for your design framework (eg: a custom input component for searching).  Feel free to move things around within the same nesting (eg: moving pagination to the top).

### Overwriting the rendering of fields

Columns of Ember Data Table can receive custom rendering.  Say we are rendering products and we want to  render the Unit Price through a custom component and whether the product is available too.

Assume the initial Ember Data Table looks like:

```hbs
  <Ui::Table
    @content={{@model}}
    @fields="label available price"
    ... # data down actions up passing from route & controller
  >
  </Ui::Table>
```

Add the `@customFields` property to indicate which fields should receive custom rendering, and use the `:data-cell` slot to implement the rendering aspect:

```hbs
  <RawDataTable
    @content={{@model}}
    @fields="label available price"
    @customFields="available price"
    ... # data down actions up passing from route & controller
  >
    <:data-cell as |cell|>
      {{#if (eq cell.attribute "price")}}
        <td>
          <Product::UnitPrice @value={{cell.value}} />
        </td>
      {{else if (eq cell.attribute "available")}}
        <td>
          {{#if cell.value}}Available{{else}}Out of stock{{/if}}
        </td>
      {{/if}}
    </:data-cell>
  </RawDataTable>
```

In this case `label` is rendered as usual, but the `price` and `available` are rendered through a custom form.  Note that the order of the columns is still the order of `@fields`.

### Overwrite the header labels

Column headers can be supplied by adding extra properties to the fields attribute split by a colon.  A single `_` will be replaced by a space and two underscores get replaced by a single underscore

```
  <RawDataTable
    @content={{@model}}
    @fields="label:Name available price:Current_price"
    ...
  />
```

## Discussions

### Why one big template file

With the advent of named slots users can overwrite things deeply nested inside Ember Data Table when using a single template.

Multiple components are used to offer certain logical processing relevant in intermediate steps (eg: `DataTable::Row`) to split up logic.  This keeps some of the logic contained.

The template file itself contains a repeating pattern to check if a block was given and use that, or render the default implementation for your design framework.  Eg. the `:menu` named slot is defined as follows in raw-data-table.hbs:

```hbs
    <dt.Menu as |General Selected enableSelection|>
      {{#if (has-block "menu")}}
        {{yield (hash General Selected) to="menu"}}
      {{else}}
        ...
      {{/if}}
    </dt.Menu>
```

The logic is contained in the `dt.Menu` component offered from above.  We first check if the `:menu` named block is given and dispatch processing to that block if it is.  Otherwise we provide our implementation.

The downside of this approach is that we have a large handlebars file in our codebase, but with good reason.  We create a dirty dustbin here so the applications using the component can stay clean.  We hope Ember Data Table design implementations get used in many applications so the heavy template outweigs the clean usage.

The default implementation will almost always be the rendered item, but we provide the end-user with escape hatches on every level to overwrite exactly the piece they need.  This makes it much more obvious what diverges from the default where we use Ember Data Table.  It makes maintenance and upgrades easier and allows apps to best express the intended diversion.

## Reference

### Arguments to Ember Data Table

These arguments are expected to be supported by specific design implementations too.

#### Common information from route and controller

The passing of data from route and controller, and moving data back up.

- `@content` :: Data to be rendered.  In case this has a `meta`
  property, this is used as default to derive amount of results and
  backend pagination offset.
- `@page` and `@updatePage` :: Indicates the current page number and the
  function called to update the current page.
- `@size` and `@updatePageSize` :: Indicates the current page size and
  the function called to update the current page size.
- `@sort` and `@updateSort` :: Returns current sorting for data table
  and a function to update the sorting.
- `@filter` and `@updateFilter` :: Supplies the user filter string and
  the function to call for updating that string.
- `@total` :: The total amount of results across all pages.  If not set,
  `@meta.count` or `@content.meta.count` is tried.
- `@isLoading` :: Truethy if the Data Table is currently loading data.

- `@meta` :: Meta may be provided in `@content.meta` or it may be
  provided in a separate property.  If supplied, it may be used to
  determine the backend pagination offset from
  `@meta.links.first.number` (generally `0` but sometimes `1`) and
  amount of results as alternative to `@total` from `@meta.count`.


#### Ember Data Table visualization configuration

How to show different things in Ember Data Table

- `@fields` :: List of fields to render with extra options.  The fields are split by spaces.  Splitting a field with a colon (`:`) makes the first element be the attribute and the second be the label.  Use an `_` to render a space in the label. Eg: `@fields="label:Name priceInEuros:Euro_price"`.
- `@sortableFields` :: List of fields by which the user may sort.
  Fields should use the attribute names of `@fields` and are split by
  spaces.  By default all fields are sortable.  Set to an empty list to
  disable sorting.
- `@noDataMessage` :: Custom message to show when no data is available.
  The `:no-data-message` block can be used as an elternative to provide
  styling.
- `@enableLineNumbers` :: Set to truethy to show line numbers in the
  table.
- `@links` :: Each row may contain a number of links.  Different links
  are split by a space in the configuration.  Each link consists of one
  to three parts split by a colon.  The first part is the route, the
  second is the label, the third is an icon to use instead of the label
  if supported (screen readers should see the label still).  Eg:
  `@links="products.edit:edit:pencil products.show:open:file-earmark-richtext"`.  
  Note that only the route is required in which case the label is
  derived and no icon is shown.  The link by default receives the `id`
  of the item but this is configurable using the `@linksModelProperty`
  attribute (see below).
- `@customHeaders` :: List of attributes for which a custom header will
  be rendered through the `:data-header` named block.  Each of the
  attributes mentioned here will not render the default header but will
  instead dispatch to the named block.  Check which attribute is being
  rendered in the named block to render the right label.  Verify in the
  implementation you override which actions are set on the columns how
  to support sorting if needed.
  
  ```hbs
  <RawDataTable
    ...
    @customHeaders="label priceInEuros"
    ...>
    <:data-header as |header|>
      {{#if (eq header.attribute "label")}}
        <th><b>Here is my label</b></th>
      {{else if (eq header.attribute "priceInEuros")}}
        <th><i>Here is my price!</i></th>
      {{/if}}
    </data-header>
  </RawDataTable>
  ```

- `@customFields` :: List of attributes for which the fields will
  receive a custom rendering.  This will render the individual cell
  values based on the `:data-cell` custom block.  You may use the
  attribute name to verify which attribute the custom block is rendering
  for.

  ```hbs
  <RawDataTable
    ...
    @customFields="label priceInEuros"
    ...>
    <:data-cell as |cell|>
      {{#if (eq cell.attribute "label")}}
        <td><Marquee>{{cell.value}}</Marquee></td>
      {{else if (eq cell.attribute "priceInEuros")}}
        <td>€{{cell.value}},-</td>
      {{/if}}
    </:data-cell>
  </RawDataTable>
  ```

#### Ember Data Table functional configuration

- `@autoSearch` :: If truthy, search is automatically triggered
  without explicitly pressing search.  If a number is provided, this is
  the time in milliseconds before sending the request.  If no number is
  supplied a default is used.
- `@hasMenu` :: If not truthy, the component will show the supplide
  menu.  This allows controlling whether the menu should be shown
  dynamically.  The menu may contain actions which act on the current
  selection.
- `@enableSelection` :: Whether items should be selectable.  Items are
  selectable across pages and may be acted on using the
  `:selection-menu-actions` or `:selection-menu` named blocks.
- `@linksModelProperty` :: When a link is clicked the row must supply
  information to the link to indicate which item was clicked.  By
  default the `id` property is used but another attribute may be
  supplied if desired (such as `uuid` when using mu-search).  An empty
  string will provide the full object.
- `@attributeToSortParams` :: Which attributes may be sorted on.  This
  defaults to all attributes.  You may choose to provide only some
  attributes.  Setting this to the empty string disables sorting on all
  fields.
- `@onClickRow` :: Action to be triggered when the row is clicked.  This
  is an alternative for the row link but it triggers an action rather
  than following a route.
- `@rowLink` :: Link to be used when users click on the full row.  This
  is an easier click target for users than an icon on the side.  Ideally
  the that target is provided too.  `@onClickRow` may be provided to
  call a function instead but this is less accessible.
- `@rowLinkModelProperty` :: When `@rowLink` is used, the `id` property
  of the model rendered in the row will be supplied to the link.  The
  property may be overriden by this property.  Set to `uuid` when using
  mu-search for instance, or set to empty string to supply the full
  model.

#### Overriding Ember Data Table parts using named blocks

Various named blocks are offered, check your Ember Data Table design implementation to see which part needs to be overridden.  A list is provided here for reference.

