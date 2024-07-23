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
- `@attributeToSortParams` :: Function which translates an attribute to
  its sort parameters.  The sort parameters is currently a hash which
  contains a key (default `'asc'` and `'desc'` to indicate sorting up
  and down) and the corresponding sort key which should be sent out of
  Ember Data Table (and used in the sort hash to the backend).  More
  options than `'asc'` and `'desc'` can be provided if the backend
  understands different sorting strategies.
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

- `search` :: Overrides the full search component.  Receives a search hash with properties:
  - `filter` :: User's filter
  - `placeholder` :: Placeholder for the text search
  - `autoSearch` :: Value for autoSearch as supplied by the user
    (subject to change)
  - `submitForm` :: Action which can be used to submit the search form
    and trigger search update
  - `handleAutoInput` :: Action which can handle auto input by
    debouncing and updating the search string
  - `handleDirectInput` :: Action which handles the event where a user
    types, gets value from `event.target.value`.

- `menu` :: Overrides the full menu rendering.  Receives three positional arguments:
  - `General` :: Component with information about the General menu which
    is rendered when nothing is selected.  The block given to General
    receives an argument which should be passed to `:general-menu`.
  - `Selected` :: Component with information on handling selected items.
    The block given to Selected receives `selected` which should be
    passed to `:selection-menu`.

- `general-menu` :: Implements the menu with actions which is shown when
  no items are selected.  Receives a hash with two items:
  - `dataTable` :: The main DataTable object on which actions can be
    called.
  - `selectionIsEmpty` :: Whether items are currently selected or not.

- `selection-menu` :: This menu is rendered only when items have been
  selected.  It is the main wrapper which contains
  `:selection-menu-actions` (which you'd likely want to override
  instead) as well as some visual information on the selected items.  It
  receives a hash with four elements:
  - `selectionIsEmpty` :: Whether the selection is currently empty.
  - `selectionCount` :: The amount of items which are selected at this point.
  - `clearSelection` :: An action to clear the whole selection.
  - `selection` :: Copy of the selected items which can be passed to other functions.
  - `dataTable` :: The DataTable object.

- `selection-menu-actions` :: Contains the actions which can be applied
  to a selection.  This is likely custom for each use of the Ember Data
  Table (versus the template).  Receives the same argument as
  `:selection-menu`.

- `content` :: This block is the full table but without search, actions
  or pagination.  It must render the table tag and everything in it.  It
  receives a hash with three elements.
  - `Header` :: The Header logical component which contains information
    to render the header row.  Supplying a block to Header will yield
    with the content for the `:header` named block.
  - `Body` :: The Body logical component which contains information to
    render each of the body rows.  Supplying a block to Body will yield
    with the content for the `:body` named block.
  - `dataTable` :: The DataTable object.

- `full-header` :: This block should render the `<thead>` with the header row
  inside of it.  Receives a hash with the following items:
    - `enableSelection` :: Whether or not selection is enabled.
    - `enableLineNumbers` :: Whether or not line numbers are enabled.
    - `sort` :: Sort parameter.
    - `updateSort` :: Function to update sorting.
    - `hasLinks` :: Whether custom links are provided for this table (as
      per the `@links` argument to DataTable).
    - `customHeaders` :: Headers which should be rendered in a custom way
      as an array or strings.
    - `fields` :: A complex fields object containing the information about
      each column to be rendered:
      - `attribute` :: the attribute to be rendered
      - `label` :: the label of the header
      - `isSortable` :: whether this column is sortable or not
      - `sortParameters` :: hash which indicates in which ways this field
        can be sorted (ascending, descending, something else).  See
        `@attributeToSortParams`.
      - `hasCustomHeader` :: whether this column has a custom header or
        not (meaning we should render it through the `:data-header`
        named block)
      - `isCustom` :: whether the field rendering should be custom or not
        (meaning data cells should be rendered through `:data-cell`).
    - `dataHeadersInfo` :: information for the data headers.  Supplied to
      `:data-headers` named block.
    - `ThSortable` :: Contextual component.  When calling this component
      `@field` must be supplied (to generate info for a given field when
      looping over `header.fields`) and `@hasCustomBlock` which should
      indicate whether a `:data-header` is given.  Supplying a block to
      ThSortable will yield with the content for the `:data-header`
      named block.  The aforementioned content also has a
      `renderCustomBlock` which can be used to detect whether a custom
      block should be rendered for this block or not.
- `data-headers` :: This is inside the `<tr>` of the `<thead>` and
  should render all headers for the attributes.  Thus ignoring the
  headers for selection, numbers and actions.  It receives a hash
  containing the following elements:
  - `fields` :: The fields to be rendered (see `fields` above for all
    the attributes).
  - `customHeaders` :: Headers which should be rendered in a custom way
    as an array or strings.
  - `sort` :: Sort parameter.
  - `updateSort` :: Function to update sorting.
- `data-header` :: Renders a custom header which should handle sorting
  etc.  Receives a hash with the following elements:
  - `label` :: Label of the header.
  - `attribute` :: Attribute which will be rendered in this column.
  - `isSortable` :: Whether this column is sortable or not.
  - `isSorted` :: Whether sorting is applied to this header or not.
  - `toggleSort` :: Action which switches to the next sorting method
    (eg: from `'asc'` to `'desc'` or from `'desc'` to nothing).
  - `nextSort` :: Next way of sorting.  This is obvious for
    `["asc","desc",""]` but users may have provided multiple sorting
    methods through `@attributeToSortParams`.
  - `isAscending` :: Are we sorting ascending now?
  - `isDescending` :: Are we sorting descending now?
  - `sortDirection` :: What is the key on which we are sorting now (eg: `"desc"`)
  - `renderCustomBlock` :: Should a custom block be rendered for this data header?
  - `isCustom` :: Is the header explicitly marked to render custom?
  - `hasCustomHeaders` :: Are there any custom headers to be rendered?

- `actions-header` :: Header which will contain all actions.  Receives no arguments.

- `body` :: Renders the full body of the table, including the `<tbody>`
  tag.  Receives a hash containing:
  - `isLoading` :: Is the data being loaded at this point?  Probably
    need to render `:body-loading` named block then.
  - `content` :: The actual content of this Data Table.
  - `offset` :: The index of the first element in this data table.
  - `wrappedItems` :: Rows of the data table in a way through which they
    can be selected.
  - `enableLineNumbers` :: Whether line numbers are enabled or not.
  - `hasClickRowAction` :: Wheter something needs to happen when the row
    is clicked.  Either because there is an `@onClickRow` or because
    there is a `@rowLink`.
  - `onClickRow` :: Action to be called when user clicked on a row, if
    supplied by user of this Data Table.
  - `toggleSelected` :: Action which allows to toggle the selection
    state of the current row.  Should receive the an element from
    `wrappedItems` as first element and the event that caused it (will
    check `event.target.fetched`) as second argument.
  - `selection` :: Currently selected items.
  - `enableSelection` :: Whether selection of items is enabled.
  - `linkedRoutes` :: Array of objects describing each of the routes
    which should be linked as custom links per row.  Each item is a hash
    with the following elements:
    - `route` :: The route to which we should link.
    - `label` :: The human-readable label for the route if supplied.
    - `icon` :: The icon which should be rendered for the link, if supplied.
    - `linksModelProperty` :: The property of the model which should be
      supplied to the route (eg: `id` for the id or `""` if the whole
      object should be supplied).
  - `rowLink` :: The route which should be used when users click on the
    row itself.
  - `rowLinkModelProperty` :: The property of the model which sholud be
    supplied to the `rowLink` route (eg: `id` for the id or `""` if
    the whole object should be supplied).
  - `noDataMessage` :: String message which the user asked to render
    when no data was supplied.
  - `fields` :: Array of objects describing each of the fields to be
    rendered.  See `fields` higher up.
  - `Row` :: Contextual component handling the logic of an individual
    row.  This has te be called for each row in the visible table and it
    should receive `@wrapper` for the element of `wrappedItems` we are
    rendering here, as well as the `@index` for the index we are looping
    over here.  The `@index` is a local index for this rendering
    regardless of the page, so you can use `{{#each body.wrappedItems as
    |wrapper index|}}<body.Row @wrapper={{wrapper}}
    @index={{index}}>...</body.Row>{{/each}}`.
- `body-loading` :: Renders a custom body loading message supplied in
  this invocation of Ember Data Table.
- `row` :: Renders an individual row, including the `<tr>` tag.  This is
  the row with both the data elements as well as with the meta elements
  such as selection of items and links.  Receives a hash with the
  following elements:
  - `wrapper` :: An object containing the item and the selection status.
  - `item` :: Actual item to be rendered in this row.
  - `enableLineNumbers` :: See above.
  - `lineNumber` :: See above.
  - `enableSelection` :: See above.
  - `selected` :: Whether this row is selected or not.
  - `isSelected` :: Whether this item is selected or not (same as
    selected).
  - `toggleSelected` :: See above.
  - `hasClickRowAction` :: See above.
  - `onClickRow` :: See above.
  - `linkedRoutes` :: A copy of `linkedRoutes` as mentioned above but
    adding the `model` key which contains the specific model to supply
    to the linked route for this row (eg: the `id`, `uuid` or the full
    `item`)
  - `fields` :: See above.
  - `DataCells` :: Contextual component which provides information for
    rendering the data cells of a row.  Supplying a block to DataCells
    will yield a block which is used forrendering the `:dataCells` named
    block.
- `data-cells` :: Renders all the cells containing real data in a row.
  This includes selection of the row and links.  Receives a hash with
  the following elements:
  - `fields` :: See above.
  - `firstColumn` :: The field of the first column to be rendered.  Good
    for designs where the first column should receive different styling.
  - `otherColumns` :: The fields of all columns but the first one to be
    rendered.  Good for designs where the first column should receive
    different styling.
  - `wrapper` :: See above.
  - `item` :: See above.
  - `rowLink` :: See above.
  - `rowLinkModel` :: Model to supply to the route specified by `rowLink` for this specific row. # =@wrapper.rowLinkModel
  - `fields` :: See above.
  - `DataCell` :: Contextual component which provides information for
    rendering an individual cell.  Should receive `@column` with the
    field to render and `@hasCustomBlock` with `{{has-block
    "data-cell"}}` so we know whether a custom block was provided for
    the `data-cell` named slot.
- `data-cell` :: Renders a custom data cell regardless of whether it's
  first or any other.  Receives a hash with the following elements:
  - `firstColumn` :: See above.
  - `otherColumns` :: See above.
  - `item` :: See above.
  - `rowLink` :: See above.
  - `rowLinkModel` :: See above.
  - `label` :: See above.
  - `fields` :: See above.
  - `isCustom` :: Is the cell explicitly marked to render custom?
  - `hasCustomFields` :: Whether there are custom fields to be
    rendered.
  - `attribute` :: The attribute which will be rendered.
  - `renderCustomBlock` :: Whether a custom block should be rendered
    for this field.  This is the named slot `:data-cell`.
  - `value` :: The value which should be rendered.
- `first-data-cell` :: In designs which care about the first data cell
  versus the others, this will render a custom design for the first data
  column of the table.  Receives the same arguments as `data-cell`.
- `rest-data-cell` :: In designs which care about the first data cell
  versus the others, this will render a custom design for the other data
  columns of the table.  Receives the same arguments as `data-cell`.
- `actions` :: Renders the links next to each row specified through
  `@links`.  Receives the same arguments as `row`.
- `no-data-message` :: Rendered when no data was available in the data
  cell.  When no styling is needed, `@noDataMessage` can be used
  instead.
- `pagination` :: Renders everything needed to handle pagination.
  Receives a hash with the following elements:
  - `startItem` :: Number of the first item rendered on this page.
  - `endItem` :: Number of the last item rendered on this page.
  - `total` :: Total amount of items on all pages of this table.
  - `hasTotal` :: Whether the total amount of items is known.
  - `pageSize` :: Amount of items per page (though the last page may have fewer items).
  - `pageNumber` :: The page number as seen by a human (first page is 1
    regardless of the backend using 0 for the first page or not).
  - `numberOfPages` :: Total number of pages avaialeble.
  - `pageOptions` :: Array containing a number for each page available
    in the data table in human form (can be used for rendering buttons).
  - `summarizedPageOptions` :: A smart way of showing pages.  Yields a list of page numbers with:
    - the leftmost being the first page number,
    - followed by the string 'more' if empty spots follow,
    - followed by up to three pages less than the current page,
    - followed by the current page number,
    - followed by up to three pages after the current page number,
    - followed by 'more' if empty spots follow,
    - followed by the last page number.
  - `sizeOptions` :: The different sizes (as an array) for pages of this Data Table.
  - `firstPage` :: The first page number in this Data Table.
  - `lastPage` :: The last page number in this Data Table.
  - `nextPage` :: The next page number in this view, `undefined` if this
    is the last page.
  - `previousPage` :: The previous page number in this view, `undefined`
    if this is the first page.
  - `updatePage` :: Function which takes a backend page number and
    updates it (this is the raw function supplied to `DataTable`.
  - `humanPage` :: Thu current page in human form.
  - `updateHumanPage` :: Updates the human page number (this will call
    `updatePage` after mapping the human page number through the backend
    page number offset).
  - `selectSizeOption` :: Selects a new size option, takes `event` as
    input and gets the new value from `event.target.value`.
  - `setSizeOption` :: Selects a new size, takes the `size` as either
    string or as number and calls the `@updateSize` function supplied to
    Data Table.
  - `hasMultiplePages` :: Whether this Data Table has multiple pages or
    not.
  - `isFirstPage` :: Whether we are now rendering the first page or
    not.
  - `isLastPage` :: Whether we are rendering the last page or not.
  - `hasPreviousPage` :: Whether there is a previous page or not.
  - `hasNextPage` :: Whether there is a next page or not.
  - `meta` :: If meta is available, it will be stored here. This may
    contain page links.
  - `backendPageOffset` :: The current backend page offset (either
    calculated or guessed).
