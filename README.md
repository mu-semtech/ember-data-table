# Ember Data Table
[![Build Status](https://travis-ci.org/mu-semtech/ember-data-table.svg?branch=master)](https://travis-ci.org/mu-semtech/ember-data-table)
[![npm version](https://badge.fury.io/js/ember-data-table.svg)](https://badge.fury.io/js/ember-data-table)

Data table for EmberJS

## Tutorials

### Add basic Ember Data Table

Find an adaptation of Ember Data Table for the design framework of your choice or implement a custom variant for your application.  This tutorial uses `RawDataTable`. Alternatively look at the examples in [the dummy app](/addon/tests/dummy/app).

Generate a route for products first:

```bash
ember g route products/index
```

The tutorial assumes a model exists with `label` and `price` which you can generate using:

```bash
ember g model product label:string price:number
```

Next you'll fetch content from the back-end using standard model hooks and query parameters.
For the route stored in `/app/routes/products/index.js` write:

```javascript
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Route from '@ember/routing/route';

export default class DataTableRoute extends Route {
  @service store;

  modelName = 'product';

  queryParams = {
    filter: { refreshModel: true },
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
  };

  model(params) {
    const options = {
      sort: params.sort,
      page: {
        number: params.page,
        size: params.size,
      },
    };
    if (params.filter) {
      options['filter'] = params.filter;
    }
    return this.store.query(this.modelName, options);
  }

  @action
  loading(transition) {
    // eslint-disable-next-line ember/no-controller-access-in-routes
    let controller = this.controllerFor(this.routeName);

    if(controller) {
      controller.isLoadingModel = true;

      transition.finally(function () {
        controller.isLoadingModel = false;
      });
    }

    return true; // bubble the loading event
  }
}
```

For the controller stored in `/app/controllers/product/index.js` write:

```javascript
import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';

export default class DataTableController extends Controller {
  queryParams = ['size', 'page', 'filter', 'sort'];

  @tracked size = 10;
  @tracked page = 0;
  @tracked filter = '';
  @tracked sort = '';
  @tracked isLoadingModel = false;
}
```

These steps are the same for any Ember Data Table flavour, the following visualizes `RawDataTable`:

```hbs
<RawDataTable
  @content={{@model}}
  @fields="label price"
  @isLoading={{this.isLoadingModel}}
  @filter={{this.filter}}
  @sort={{this.sort}}
  @page={{this.page}}
  @size={{this.size}}
  @updateFilter={{fn (mut this.filter)}}
  @updateSort={{fn (mut this.sort)}}
  @updatePage={{fn (mut this.page)}}
  @updatePageSize={{fn (mut this.size)}} />
```

Visiting `http://localhost:4200/products` will now show the Raw Data Table.

If the backend does not provide pagination details in `@model.meta` or total items in `@model.meta.count`, the total can be provided via `@total` to get working pagination buttons.

See [serializer_example](/serializer_example.md) for a serializer to use or use as inspiration to correctly parse meta information for pagination. 

## How-to guides

### Implementing a new style

Adapt Ember Data Table to your application or design framework, or find a suitable adaptation.  Some examples are listed below.  The best approach to build a new style is to copy the file from `ember-data-table/addon/components/raw-data-table.hbs` and adapt it to your needs from top to bottom.

The file is long, yet much can be left as is.  Only the HTML parts of the file need to be overwritten to suit your needs.  Liberally add wrapping tags and classes and use custom input components for your design framework (e.g.: a custom input component for searching).  Feel free to move things around within the same nesting (e.g.: moving pagination to the top).

### Overwriting the rendering of fields

Columns of Ember Data Table can receive custom rendering.  Say you will render products and you want to render the Unit Price and product availability in a custom way.

Assume the initial Ember Data Table looks like:

```hbs
  <Ui::Table
    @content={{@model}}
    @fields="label available price"
    ... # data down actions up passing from route & controller
  >
  </Ui::Table>
```

The `@customFields` property lists which fields which receive custom rendering.  Use the `:data-cell` slot to implement the rendering aspect:

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

This configuration renders `label` as usual.  `price` and `available` render through the named slot.  Note that the order of the columns is still the order of `@fields`.

Alternatively the components to use for rendering can be passed directly via `@customFields` by passing an object:
```hbs
<RawDataTable
    @content={{@model}}
    @fields="label available price"
    @customFields={{hash available=(component "availability") price=(component "price") }}
  />
```

### Overwrite the header labels

Supply column headers by adding extra properties to the fields attribute, split by a colon.  A single `_` gets replaced by a space and two underscores get replaced by a single underscore

```hbs
  <RawDataTable
    @content={{@model}}
    @fields="label:Name available price:Current_price"
    ...
  />
```

Alternatively, pass the field (key `attribute`) and header (key `label`) via an object.  This is only possible when passing the fields via an array.
```hbs
  <RawDataTable
    @content={{@model}}
    @fields={{array "label:Name" "available" (hash attribute="price" label="Current price")}}
    ...
  />
```


## Discussions

### Why one big template file

Named slots let users overwrite things deeply nested inside Ember Data Table when using a single template.

Contextual components split logical processing in intermediate steps (e.g.: `DataTable::Row`) and get unified in one template.  This keeps the logic contained and allows users to overwrite only the specifics.

The template file itself contains a repeating pattern to check if a block is given and use that, or render the default implementation for your design framework.  Eg. the `:menu` named slot is defined as follows in raw-data-table.hbs:

```hbs
    <dt.Menu as |General Selected enableSelection|>
      {{#if (has-block "menu")}}
        {{yield (hash General Selected) to="menu"}}
      {{else}}
        ...
      {{/if}}
    </dt.Menu>
```

The `dt.Menu` component contains the logic and is supplied by the enclosing scope.  First check if the `:menu` named block is given and dispatch processing to that block if it's available.  Otherwise use an implementation suiting for your design framework in '...'.

The downside of this approach is a large handlebars file, but with good reason.  The dustbin here lets consuming applications of stay clean.  We hope Ember Data Table design implementations get used in many applications so the heavy template outweighs the clean usage.

The default implementation will be used most often, but the end-user receives an escape hatch on every level to overwrite exactly the piece they need.  The focus is placed on what diverges from the default where we use Ember Data Table.  This makes maintenance and upgrades easier and lets apps better express the intended diversion.

## Reference

### Serializer
Ember Data Table expects meta (pagination) information in a specific format. The provided [serializer](/addon/serializer.js) can be used in case of a JSONAPI, or it can be used as an inspiration for a custom serializer.

### Arguments to Ember Data Table

These arguments should be supported by specific design implementations too.

#### Common information from route and controller

The passing of data from route and controller, and moving data back up.

- `@content` :: Data (an array of items) to be rendered.  In case this has a `meta`
  property, this is used as default to derive amount of results and
  back-end pagination offset.
- `@page` and `@updatePage` :: Set the current page number and the
  function called to update the current page.
- `@size` and `@updatePageSize` :: Set the current page size and
  the function called to update the current page size.
- `@sort` and `@updateSort` :: Set the current sorting for data table
  and the function called to update the sorting.
- `@filter` and `@updateFilter` :: Set the user search string and
  the function called to update that string.
- `@total` :: The total amount of results across all pages.  If not set,
  `@meta.count` or `@content.meta.count` is tried.
- `@isLoading` :: Whether to show the Data Table in its loading state.

- `@meta` :: Meta may be provided in `@content.meta` or it may be
  provided in this property.  If supplied, it may be used to
  determine the back-end pagination offset from
  `@meta.links.first.number` (often `0` but sometimes `1`), pagination in
  `@meta.pagination` and
  amount of results from `@meta.count` as an alternative to `@total`.


#### Ember Data Table visualization configuration

How to show different things in Ember Data Table

- `@fields` :: Array of objects/strings or space-separated string of fields to render (in given order) with extra options.  Each field can consists of two parts, split by a colon (`:`) for string syntax.  The first part is the attribute (key `attribute`, in string syntax `_` are rendered as spaces), the second an optional label (key `label`).  If no label is provided, the attribute is used as the label.  E.g.: `@fields="label:Name priceInEuros:Euro_price available"` or `@fields={{array "label:Name" (hash attribute="priceInEuros" label="Euro price") "available"}}`.
Other keys can also be passed when using the object syntax. These take precedence over other configurations to set up visualization logic:
    - `attribute`: mandatory attribute this configuration is meant for
    - `label`: label for the attribute, used in the column heading
    - `isSortable`: set to false if this field should not be sortable. Default is true. Setting `sortParameters` or `@sortableFields` will take precedence.
    - `sortParameters`: directly pass the sorting parameters, same form as return value of `@attributeToSortParams`.
    - `hasCustomHeader`: set to true to render this field header via the `:data-header` named block, like `@customHeaders`.
    - `customHeaderComponent`: Pass a component to use for rendering this header, like `@customHeaders`.
    - `isCustom`: set to true to render this field via the `:data-cell` named block, like `@customFields`.
    - `customFieldComponent`: Pass a component to use for rendering this field's cells, like `@customFields`.
          
- `@sortableFields` :: Array or space-separated string of fields by which the user may sort.
  Fields should use the attribute names of `@fields`.  By default all fields are sortable.  Set to an empty list or empty string to disable sorting.
- `@noDataMessage` :: Custom message to show when no data is available.
  The `:no-data-message` block can be used as an alternative to provide
  styling.
- `@enableSearch` :: Set to false to disable search in the table.
- `@searchPlaceholder` :: Custom placeholder text for the search input box. Defaults to 'Search input'.
- `@enableLineNumbers` :: Set to truthy to show line numbers in the
  table.
- `@sizes` :: Array or space-separated string of page size choices that should be shown in the pagination block.  Defaults to `[5, 10, 25, 50, 100]`.  Set to an empty list or empty string to hide.
- `@links` :: Array of objects/strings or a space-separated string of links with extra options.  
  Each row may contain a number of clickable links rendered in a separate column.  Each link consists of one
  to three parts, split by a colon for string syntax.  The first part is the route (key `route`), the
  second is the label (key `label`, in string syntax `_` are rendered as spaces), the third is an icon (key `icon`) to use instead of the label
  if supported (screen readers should see the label still).  E.g. (both equivalent):
  `@links="products.edit:edit:pencil products.show:open:file-earmark-richtext"`   
  `@links={{array (hash route="products.edit" label="edit" icon="pencil") "products.show:open:file-earmark-richtext"}}`.  
  Note that only the route is required in which case the label is
  derived and no icon is shown.  By default the link receives the `id`
  of the item, but is configurable using the `@linksModelProperty`
  attribute (see below).
- `@customHeaders` :: An object (hash) or an array/space-separated string of attributes.
  When passing an array/space-separated string, the attributes will be rendered through the `:data-header` named block, instead of rendering the default header.
  When passing an object, set as key the attribute and value the component to use for rendering.  The component will receive in `@header` the same hash given to the `:data-header` block.  If value is empty, the attribute will be rendered through the `:data-header` named block.
  For the `:data-header` named block, check which attribute is being rendered to render the right label.  
  Check in the implementation you override how sorting is supported, if sorting is needed for this header.
  
  ```hbs
  <RawDataTable
    ...
        @customHeaders={{hash label="" priceInEuros="" available=(component   customComponent)}}
    or  @customHeaders={{array "label" "priceInEuros"}}
    or  @customHeaders="label priceInEuros"
    
    ...>
    <:data-header as |header|>
      {{#if (eq header.attribute "label")}}
        <th><b>Here is my label</b></th>
      {{else if (eq header.attribute "priceInEuros")}}
        <th><i>Here is my price!</i></th>
      {{/if}}
    </:data-header>
  </RawDataTable>
  ```

- `@customFields` :: An object (hash) or an array/space-separated string of attributes. 
  When passing an array/space-separated string, the attributes will be rendered through the `:data-cell` named block.
  When passing an object, set as key the attribute and value the component to use for rendering.  The component will receive in `@cell` the same hash given to the `:data-cell` block.  If value is empty, the attribute will be rendered through the `:data-cell` named block.
  For the `:data-cell` named block, use the attribute name to verify which attribute the custom block is rendering for.

  ```hbs
  <RawDataTable
    ...
        @customFields={{hash label="" priceInEuros="" available=(component   customComponent)}}
    or  @customFields={{array "label" "priceInEuros" }}
    or  @customFields="label priceInEuros" 
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
  the time in milliseconds to wait for input before sending the request (input douncing).  
  If not set, autosearch is enabled with a default wait of 2000ms.
- `@showMenu` :: If false, the component will hide the supplied
  menu.  This allows controlling whether the menu should be shown
  dynamically.  The menu may contain actions which act on the current
  selection.
- `@enableSelection` :: Whether items should be selectable.  Items are
  selectable across pages and may be acted on using the
  `:selection-menu-actions` or `:selection-menu` named blocks.
- `@initialSelection` :: The selection to use as long as the user has not changed the selection yet.  
- `@selectionProperty` :: By default equality will be checked by direct comparison of objects, which works for e.g. ember-data records. If a specific property should be used for comparison (e.g. `uuid` when using mu-search), a property name or path can be supplied.
- `@selection` and `@updateSelection`: set the current selection and function that gets called when selection changes. This gives more control over handling selection logic.
- `@linksModelProperty` :: When a link is clicked the row must supply
  information to the link to indicate which item was clicked.  By
  default the `id` property is used, but another property name or path may be
  supplied if desired (such as `uuid` when using mu-search).  An empty
  string will provide the full object.
- `@attributeToSortParams` :: Function which translates an attribute name to
  its sort parameters.  The sort parameters are a hash
  with key the sort name to use in the table and value the corresponding sort key to sent out of Ember Data Table (and used in the sort hash to the back-end via `updateSort`).  
  By default, for input `attributeName`, it returns `{ 'asc': 'attribute-name', 'desc': '-attribute-name'}`.  
  More options can be provided if the back-end understands different sorting strategies.
- `@rowLink` :: Link to be used when users click on the full row.  This
  is an easier click target for users than an icon on the side.  Ideally
  that target is provided too.  `@onClickRow` may be provided to
  call a function instead but this is less accessible.
- `@onClickRow` :: Callback to be triggered when the row is clicked.  
  Receives the clicked item (from `@content`) as its first argument.  This
  is an alternative for the row link but it triggers an action rather
  than following a route.
- `@rowLinkModelProperty` :: When `@rowLink` is used, the `id` property
  of the model rendered in the row will be supplied to the link.  The
  property may be overridden by this property.  Set to `uuid` when using
  mu-search for instance, or set to empty string to supply the full
  model.

#### Overriding Ember Data Table parts using named blocks

Various named blocks are offered, check your Ember Data Table design implementation to see which part needs to be overridden.  A list is provided here for reference as used in `raw-data-table.hbs`.

- `:search` :: Overrides the full search block.  Receives a hash containing:
  - `filter` :: User's filter string
  - `placeholder` :: Placeholder for the text search input
  - `autoSearch` :: Value for autoSearch as supplied by the user (boolean or number).
  - `submitSearch` :: Action which can be used to trigger a search string update (`@updateFilter`)
  - `handleInput` :: Action which expects and event (with value in `event.target.value`)
  and updates the search string immediately or after a debounce time, depending on `@autoSearch` value.
  - `handleAutoInput` :: Like `handleInput`, but always uses a debounce time (even if `@autoSearch` is falsy).
  - `handleDirectInput` :: Like `handleInput`, but always updates immediately (ignoring `@autoSearch` value).
  

- `:menu` :: Overrides the full menu block.  Receives a hash containing:
  - `General` :: Component with information about the General menu which
    is rendered when nothing is selected.  The block given to General
    receives one block parameter which should be passed to `:general-menu`. 
    See `:general-menu` for the parameter details of `General`. 
  - `Selected` :: Component with information on handling selected items.
    The block given to Selected receives one block parameter which should be
    passed to `:selection-menu`.  
    See `:selection-menu` for the parameter details of `Selected`.
  - `enableSelection` :: Whether selection is enabled.

- `:general-menu` :: Implements the menu with actions which is shown when
  no items are selected.  Receives a hash containing:
  - `dataTable` :: The main DataTable object on which actions can be
    called.
  - `selectionIsEmpty` :: Whether items are currently selected or not.

- `:selection-menu` :: This menu is rendered only when items have been
  selected.  It's the main wrapper which contains
  `:selection-menu-actions` (which you'd likely want to override
  instead) as well as some visual information on the selected items.  Receives a hash containing:
  - `selectionIsEmpty` :: Whether the selection is currently empty.
  - `selectionCount` :: The amount of items which are selected at this point.
  - `clearSelection` :: An action to clear the whole selection.
  - `selection` :: Copy of the selected items which can be passed to other functions.
  - `dataTable` :: The DataTable object.

- `selection-menu-actions` :: Contains the actions which can be applied
  to a selection, rendered at the same time as `:selection-menu`.  
  This is likely custom for each use of the Ember Data
  Table (versus the template).  Receives the same argument as
  `:selection-menu`.

- `:content` :: This block is the full table but without search, menu actions
  or pagination.  It must render the table tag and everything in it.  
  Receives a hash containing:
  - `Header` :: The Header logical component which contains information
    to render the header row.  Has the same block parameter hash as `:full-header` below.
  - `Body` :: The Body logical component which contains information to
    render each of the body rows.  Has the same  block parameter hash as `:body` below.
  - `dataTable` :: The DataTable object.

- `:full-header` :: This block should render the `<thead>` with the header row
  inside of it.  Receives a hash containing:
    - `enableSelection` :: Whether selection is enabled.
    - `enableLineNumbers` :: Whether line numbers are enabled.
    - `sort` :: Current sort parameter.
    - `updateSort` :: Function to update sorting (see `@updateSort`).
    - `hasLinks` :: Whether custom links are provided for this table (as
      per the `@links` argument to DataTable).
    - `customHeaders` :: Headers which should be rendered in a custom way
      as an array of strings.
    - `fields` :: An array of complex fields object containing the information about
      each data column to be rendered:
      - `attribute` :: the attribute to be rendered
      - `label` :: the label of the header
      - `isSortable` :: whether this column is sortable or not
      - `sortParameters` :: hash which indicates in which ways this field
        can be sorted (ascending, descending, something else).  See output of
        `@attributeToSortParams`.
      - `hasCustomHeader` :: whether this column has a custom header or
        not (meaning it should be rendered through the `:data-header`
        named block).
      - `isCustom` :: whether the field rendering should be custom or not
        (meaning data cells should be rendered through `:data-cell`).
      - `customFieldComponent` :: Available if the field rendering should use this custom component for rendering.
      - `customHeaderComponent` :: Available if the column header should use this custom component for rendering.
    - `dataHeadersInfo` :: information for the data headers.  Supplied to
      `:data-headers` named block.
    - `ThSortable` :: Contextual component.  When calling this component
      `@field` must be supplied (to generate info for the specific field when
      looping over `header.fields`) and `@hasCustomBlock` which should
      indicate whether a `:data-header` block is given.  Has the same block parameter hash as `:data-header` below.  This block parameter contains
      `renderCustomBlock` which can be used to detect whether a custom
      block should be rendered for this block or not.
- `:data-headers` :: This is inside the `<tr>` of the `<thead>` and
  should render all headers for the attributes.  Thus ignoring the
  headers for selection, numbers and actions.  Receives a hash
  containing:
  - `fields` :: The fields to be rendered (same `fields` as `:full-header`).
  - `customHeaders` :: Headers which should be rendered in a custom way
    as an array of strings.
  - `sort` :: Sort parameter.
  - `updateSort` :: Function to update sorting (see `@updateSort`).
- `:data-header` :: Renders a custom header for headers specified in `@customHeaders`, which should handle sorting etc.  Receives a hash containing:
  - `label` :: Label of the header.
  - `attribute` :: Attribute which will be rendered in this column.
  - `isSortable` :: Whether this column is sortable or not.
  - `isSorted` :: Whether sorting is applied to this header or not.
  - `toggleSort` :: Action which switches to the next sorting method
    (e.g.: from `'asc'` to `'desc'` or from `'desc'` to nothing by default).
  - `nextSort` :: Next way of sorting.  This is clear for
    `['asc','desc','']` but users may have provided other sorting
    methods through `@attributeToSortParams`.  The order is always alphabetically.
  - `isAscending` :: Whether the current sorting is ascending (`'asc'`).
  - `isDescending` :: Whether the current sorting is descending (`'desc'`).
  - `sortDirection` :: What's the key on which we're sorting now (e.g.: `'desc'`)
  - `renderCustomBlock` :: Whether a custom block should be rendered for this data header.
  - `isCustom` :: Truthy if the header is explicitly marked to render custom.
  - `hasCustomHeaders` :: Truthy if there are any custom headers to be rendered.

- `:actions-header` :: Header which will contain all actions.  Receives no arguments.

- `:body` :: This block renders the full body of the table, and should include the `<tbody>`
  tag.  Receives a hash containing:
  - `isLoading` :: Whether the data is being loaded.
    Need to render `:body-loading` named block then.
  - `content` :: The actual content of this Data Table (all items).
  - `offset` :: The absolute index of the first element of the current page.
  - `enableLineNumbers` :: Whether line numbers are enabled or not.
  - `hasClickRowAction` :: Whether something needs to happen when the row
    is clicked.  Either because there is an `@onClickRow` or because
    there is a `@rowLink`.
  - `toggleSelected` :: Action which allows to toggle the selection
    state of the current row.  Should receive the item to toggle from
    `content` as first element and the event that caused it (will
    check `event.target.checked`) as second argument.
  - `selection` :: Currently selected items.
  - `enableSelection` :: Whether selection of items is enabled.
  - `linkedRoutes` :: Array of objects describing each of the routes
    which should be linked as custom links per row.  Each item is a hash
    with the following elements:
    - `route` :: The route to which we should link.
    - `label` :: The human-readable label for the route, if supplied.
    - `icon` :: The icon which should be rendered for the link, if supplied.
    - `linksModelProperty` :: The property of the model which should be
      supplied to the route (e.g.: `id` for the id or `""` if the whole
      object should be supplied).
  - `rowLink` :: The route which should be used when users click on the
    row itself.
  - `rowLinkModelProperty` :: The property of the model which should be
    supplied to the `rowLink` route (e.g.: `id` for the id or `""` if
    the whole object should be supplied).
  - `noDataMessage` :: String message which the user asked to render
    when no data was supplied.
  - `fields` :: Array of objects describing each of the fields to be
    rendered.  See `fields` higher up.
  - `Row` :: Contextual component handling the logic of an individual
    row.  This has to be called for each row in the visible table and it
    should receive in `@item` the element of `content` we're
    rendering here, as well as the index we're looping
    over here in `@index`.  The `@index` is a local index for this rendering
    regardless of the page, so you can use `{{#each body.content as
    |item index|}}<body.Row @item={{item}} @index={{index}}>...</body.Row>{{/each}}`.
- `:body-loading` :: Block to show a custom loading message block.
- `:row` :: Renders an individual row, including the `<tr>` tag.  This is
  the row with both the data columns as well as the meta columns
  such as selection of items and links.  Receives a hash containing:
  - `item` :: Actual item to be rendered in this row.
  - `enableLineNumbers` :: See above.
  - `lineNumber` :: See above.
  - `enableSelection` :: See above.
  - `isSelected` :: Whether this item is selected or not.
  - `toggleSelected` :: See above, but the row item is already passed.
  - `hasClickRowAction` :: See above.
  - `rowClicked` :: Function to be called when user clicked on this row.
  - `linkedRoutes` :: A copy of `linkedRoutes` as mentioned above but
    adding the `model` key which contains the specific model to supply
    to the linked route for this row (e.g.: the `id`, `uuid` or the full
    `item`)
  - `rowLink` :: The route which should be used when users click on the row itself.
  - `rowLinkModel` :: Model to supply to the route specified by `rowLink` for this specific row.
  - `fields` :: See above.
  - `DataCells` :: Contextual component which provides information for
    rendering the data cells of a row.  Has the same block parameter hash as `:data-cells` below.
- `:data-cells` :: Renders all the cells containing real data (fields) in a row.
  This excludes cells for meta columns (like selection and links).  Receives a hash containing:
  - `fields` :: All fields to be rendered. See above.
  - `firstColumnField` :: The field of the first column to be rendered.  Good
    for designs where the first column should receive different styling.
  - `otherColumnFields` :: The fields of all columns but the first one to be
    rendered.  Good for designs where the first column should receive
    different styling.
  - `item` :: See above.
  - `rowLink` :: See above.
  - `rowLinkModel` :: See above.
  - `rowClicked` :: See above.
  - `DataCell` :: Contextual component which provides information for
    rendering an individual cell.  Should receive `@column` with the
    field to render and `@hasCustomBlock` with `{{has-block "data-cell"}}` 
    so we know whether a custom block was provided for
    the `data-cell` named slot.
- `:data-cell` :: Renders a custom data cell regardless of whether it's
  first or any other.  Receives a hash containing:
  - `fields` :: See above.
  - `firstColumnField` :: See above.
  - `otherColumnFields` :: See above.
  - `item` :: See above.
  - `rowLink` :: See above.
  - `rowLinkModel` :: See above.
  - `rowClicked` :: See above.
  - `label` :: See above.
  - `isCustom` :: Wether this cell is explicitly marked to render custom.
  - `hasCustomFields` :: Whether there are any cells that are marked to render custom.
  - `attribute` :: The attribute which will be rendered.
  - `renderCustomBlock` :: Whether a custom block should be rendered
    for this field.  This block is the named slot `:data-cell`.
  - `value` :: The data value which should be rendered.
- `:first-data-cell` :: In designs which care about the first data cell
  versus the others, this will render a custom design for the first data
  column of the table.  Receives the same block parameter hash as `:data-cell`.
- `:rest-data-cell` :: In designs which care about the first data cell
  versus the others, this will render a custom design for the other data
  columns of the table.  Receives the block parameter hash as `:data-cell`.
- `:actions` :: Renders the links next to each row specified through
  `@links`.  Receives the same arguments as `:row`.
- `:no-data-message` :: Rendered when no data was available in the data
  cell.  When no styling is needed, `@noDataMessage` can be used
  instead.
- `:pagination` :: This block contains everything needed to handle pagination.
  Receives a hash containing:
  - `startIndex` :: Absolute index of the first item rendered on this page.
  - `endIndex` :: Absolute index of the last item rendered on this page.
  - `total` :: Total amount of items on all pages of this table.
  - `hasTotal` :: Whether the total amount of items is known.
  - `pageSize` :: Amount of items per page (though the last page may have fewer items).
  - `pageNumber` :: The page number as seen by a human (first page is 1
    regardless of the back-end using 0 for the first page or not).
  - `numberOfPages` :: Total number of pages available.
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
  - `sizeOptions` :: The different sizes (as an array of numbers) for pages of this Data Table.  `null` if size should not be changeable (defined by `@sizes`).
  - `firstPage` :: The first page number in this Data Table.
  - `lastPage` :: The last page number in this Data Table.
  - `nextPage` :: The next page number in this view, `undefined` if this
    is the last page.
  - `previousPage` :: The previous page number in this view, `undefined`
    if this is the first page.
  - `updatePage` :: Function which takes a back-end page number and
    updates it (this is the raw function supplied to `DataTable`).
  - `humanPage` :: The current page in human form.
  - `updateHumanPage` :: Updates the human page number.  This will call
    `updatePage` after mapping the human page number through the back-end
    page number offset.  All page numbers defined here are human page numbers.
  - `selectSizeOption` :: Selects a new size option, takes `event` as
    input and gets the new value from `event.target.value`.
  - `setSizeOption` :: Selects a new size, takes the `size` as either
    string or as number and calls the `@updateSize` function supplied to
    Data Table.
  - `hasMultiplePages` :: Whether this Data Table has multiple pages or
    not.
  - `isFirstPage` :: Whether we're now rendering the first page or
    not.
  - `isLastPage` :: Whether we're rendering the last page or not.
  - `hasPreviousPage` :: Whether there is a previous page or not.
  - `hasNextPage` :: Whether there is a next page or not.
  - `meta` :: If meta is available, it will be stored here. This may
    contain page links.
  - `backendPageOffset` :: The current back-end page offset (either
    calculated or guessed).

## Development
There is a [testing app](/test-app/app) for example configurations to test changes. The dummy app can be run via `npm start`. When running [the addon](/addon) with `npm start`, the test-app will automatically rebuild if the addon gets rebuild. This way you can develop the addon in tandem with testing it via the test-app.
