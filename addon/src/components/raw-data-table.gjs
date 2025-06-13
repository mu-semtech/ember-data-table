import { concat, fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { LinkTo } from '@ember/routing';

import { and } from 'ember-truth-helpers';
import eq from 'ember-truth-helpers/helpers/eq';
import notEq from 'ember-truth-helpers/helpers/not-eq';
import or from 'ember-truth-helpers/helpers/or';

import DataTable from './data-table.gjs';

const ClickableRow = <template>
  {{#if @hasClickRowAction}}
    <tr
      role='button'
      class='clickable {{if @isSelected "selected"}}'
      {{on 'click' @rowClicked}}
      ...attributes
    >
      {{yield}}
    </tr>
  {{else}}
    <tr class='{{if @isSelected "selected"}}' ...attributes>
      {{yield}}
    </tr>
  {{/if}}
</template>

export default <template>
  {{! template-lint-disable no-inline-styles }}
  <DataTable
    @content={{@content}}
    @fields={{@fields}}
    @autoSearch={{@autoSearch}}
    @searchPlaceholder={{@searchPlaceholder}}
    @page={{@page}}
    @size={{@size}}
    @sizes={{@sizes}}
    @total={{@total}}
    @sort={{@sort}}
    @filter={{@filter}}
    @meta={{@meta}}
    @showMenu={{@showMenu}}
    @enableSearch={{@enableSearch}}
    @enableSelection={{@enableSelection}}
    @initialSelection={{@initialSelection}}
    @selection={{@selection}}
    @updateSelection={{@updateSelection}}
    @selectionProperty={{@selectionProperty}}
    @noDataMessage={{@noDataMessage}}
    @isLoading={{@isLoading}}
    @enableLineNumbers={{@enableLineNumbers}}
    @updatePage={{@updatePage}}
    @updatePageSize={{@updatePageSize}}
    {{! change to size or vice-versa? }}
    @updateFilter={{@updateFilter}}
    @updateSort={{@updateSort}}
    @onClickRow={{@onClickRow}}
    @links={{@links}}
    @linksModelProperty={{@linksModelProperty}}
    @rowLink={{@rowLink}}
    @rowLinkModelProperty={{@rowLinkModelProperty}}
    @customHeaders={{@customHeaders}}
    @customFields={{@customFields}}
    @customFieldComponents={{@customFieldComponents}}
    @sortableFields={{@sortableFields}}
    @attributeToSortParams={{@attributeToSortParams}}
    as |dt|
  >
    {{! START: search }}
    <div class='raw-data-table'>
      {{#if dt.enableSearch}}
        <dt.Search as |search|>
          {{#if (has-block 'search')}}
            {{yield search to='search'}}
          {{else}}
            <div class='data-table-header'>
              <div class='data-table-menu'>
                <form
                  {{on 'submit' search.submitForm}}
                  class='data-table-search'
                >
                  {{#if search.autoSearch}}
                    <label>Auto Search:
                      <input
                        value={{search.filter}}
                        placeholder={{search.placeholder}}
                        {{on 'input' search.handleInput}}
                      />
                    </label>
                  {{else}}
                    <label>Search:
                      <input
                        value={{search.filter}}
                        placeholder={{search.placeholder}}
                        {{on 'input' search.handleInput}}
                      />
                    </label>
                    <button type='submit'>Search</button>
                  {{/if}}
                </form>
              </div>
            </div>
          {{/if}}
        </dt.Search>
      {{/if}}
      {{! END: search }}

      {{! START: menu }}
      {{#if (notEq @showMenu false)}}
        <dt.Menu as |menu|>
          {{#if (has-block 'menu')}}
            {{yield menu to='menu'}}
          {{else}}
            <div class='data-table-menu'>
              {{! either we have a general block or we have to have a menu }}
              <menu.General as |general|>
                {{! TODO: shouldn't this be rendered when the result is empty too? Update docs! }}
                {{#if general.selectionIsEmpty}}
                  {{yield general to='general-menu'}}
                {{/if}}
              </menu.General>
              {{#if menu.enableSelection}}
                <menu.Selected as |selected|>
                  {{#unless selected.selectionIsEmpty}}
                    {{#if (has-block 'selection-menu')}}
                      {{yield selected to='selection-menu'}}
                    {{else}}
                      <span class='item-count'>{{selected.selectionCount}}
                        item(s) selected</span>
                      <button
                        type='button'
                        {{on 'click' selected.clearSelection}}
                      >Cancel</button>
                      {{#if (has-block 'selection-menu-actions')}}
                        {{yield selected to='selection-menu-actions'}}
                      {{/if}}
                    {{/if}}
                  {{/unless}}
                </menu.Selected>
              {{/if}}
            </div>
          {{/if}}
        </dt.Menu>
      {{/if}}
      {{! END: menu }}

      {{! START: content }}
      <dt.Content as |content|>
        {{#if (has-block 'content')}}
          {{yield content to='content'}}
        {{else}}
          <div class='data-table-content'>
            {{! template-lint-disable table-groups }}
            <table class='data-table'>
              {{! START: headers }}
              <content.Header as |header|>
                {{#if (has-block 'full-header')}}
                  {{yield header to='full-header'}}
                {{else}}
                  <thead>
                    <tr>
                      {{#if header.enableSelection}}
                        <th>{{! Checkbox }}</th>
                      {{/if}}
                      {{#if header.enableLineNumbers}}
                        <th>{{! Linenumbers }}</th>
                      {{/if}}
                      {{#if (has-block 'data-headers')}}
                        {{yield header.dataHeadersInfo to='data-headers'}}
                      {{else}}
                        {{#each header.fields as |field|}}
                          <header.ThSortable
                            @field={{field}}
                            @hasCustomBlock={{has-block 'data-header'}}
                            as |dataHeader|
                          >
                            {{#if field.customHeaderComponent}}
                              {{#let
                                field.customHeaderComponent
                                as |CustomComponent|
                              }}
                                <CustomComponent @header={{dataHeader}} />
                              {{/let}}
                            {{else if dataHeader.renderCustomBlock}}
                              {{yield dataHeader to='data-header'}}
                            {{else}}
                              {{#if dataHeader.isSortable}}
                                <th
                                  class={{concat
                                    'sortable'
                                    (if dataHeader.isSorted ' sorted' '')
                                  }}
                                >
                                  <span
                                    role='button'
                                    {{on 'click' dataHeader.toggleSort}}
                                  >
                                    {{#if
                                      dataHeader.isSorted
                                    }}[{{dataHeader.sortDirection}}]{{/if}}
                                    {{dataHeader.label}}
                                  </span>
                                </th>
                              {{else}}
                                <th>{{dataHeader.label}}</th>
                              {{/if}}
                            {{/if}}
                          </header.ThSortable>
                        {{/each}}
                      {{/if}}
                      {{#if (has-block 'actions-header')}}
                        {{yield to='actions-header'}}
                      {{else}}
                        {{#if (or (has-block 'actions') header.hasLinks)}}
                          <th></th>
                        {{/if}}
                      {{/if}}
                    </tr>
                  </thead>
                {{/if}}
              </content.Header>
              {{! END: headers }}

              {{! START: body }}
              <content.Body as |body|>
                {{#if (has-block 'body')}}
                  {{yield body to='body'}}
                {{else}}
                  <tbody>
                    {{#if body.isLoading}}
                      {{#if (has-block 'body-loading')}}
                        {{yield to='body-loading'}}
                      {{else}}
                        <tr><td
                            colspan='100%'
                            class='is-loading-data'
                          >Loading...</td></tr>
                      {{/if}}
                    {{else}}
                      {{#if body.content}}
                        {{#each body.content as |item index|}}
                          <body.Row @item={{item}} @index={{index}} as |row|>
                            {{#if (has-block 'row')}}
                              {{yield row to='row'}}
                            {{else}}
                              <ClickableRow
                                @hasClickRowAction={{row.hasClickRowAction}}
                                @isSelected={{and row.enableSelection row.isSelected}}
                                @rowClicked={{row.rowClicked}}
                              >
                                {{#if row.enableSelection}}
                                  <td class='center'>
                                    <input
                                      type='checkbox'
                                      aria-label='Select row'
                                      checked={{row.isSelected}}
                                      {{on 'click' row.toggleSelected}}
                                    />
                                  </td>
                                {{/if}}
                                {{#if row.enableLineNumbers}}
                                  <td>{{row.lineNumber}}</td>
                                {{/if}}
                                <row.DataCells as |dataCells|>
                                  {{#if (has-block 'data-cells')}}
                                    {{yield dataCells to='data-cells'}}
                                  {{else}}
                                    {{!-- NOTE: you may drop this {{#if dataCells.firstColumnField}}...{{/if}} when no custom first column styling is needed --}}
                                    {{#if dataCells.firstColumnField}}
                                      <dataCells.DataCell
                                        @column={{dataCells.firstColumnField}}
                                        @hasCustomBlock={{has-block
                                          'data-cell'
                                        }}
                                        as |cell|
                                      >
                                        {{#if (has-block 'first-data-cell')}}
                                          {{yield cell to='first-data-cell'}}
                                        {{else if
                                          dataCells.firstColumnField.customFieldComponent
                                        }}
                                          {{#let
                                            dataCells.firstColumnField.customFieldComponent
                                            as |CustomComponent|
                                          }}
                                            <CustomComponent @cell={{cell}} />
                                          {{/let}}
                                        {{else if cell.renderCustomBlock}}
                                          {{yield cell to='data-cell'}}
                                        {{else}}
                                          {{! TODO: This should be based on the type of the field }}
                                          {{#if cell.rowLink}}
                                            <td>
                                              <LinkTo
                                                @route={{cell.rowLink}}
                                                @model={{cell.rowLinkModel}}
                                                style='display: inline-block; width: 100%; height: 100%; margin: 0; padding: 0;'
                                              >
                                                {{cell.value}}
                                              </LinkTo>
                                            </td>
                                          {{else}}
                                            <td>{{cell.value}}</td>
                                          {{/if}}
                                        {{/if}}
                                      </dataCells.DataCell>
                                    {{/if}}
                                    {{!-- NOTE: if you dropped custom styling for dataCells.firstColumnField then use {{#each dataCells.fields as |column|}}...{{/each}} --}}
                                    {{#each
                                      dataCells.otherColumnFields
                                      as |column|
                                    }}
                                      <dataCells.DataCell
                                        @column={{column}}
                                        @hasCustomBlock={{has-block
                                          'data-cell'
                                        }}
                                        as |cell|
                                      >
                                        {{#if (has-block 'rest-data-cell')}}
                                          {{yield cell to='rest-data-cell'}}
                                        {{else if column.customFieldComponent}}
                                          {{#let
                                            column.customFieldComponent
                                            as |CustomComponent|
                                          }}
                                            <CustomComponent @cell={{cell}} />
                                          {{/let}}
                                        {{else if cell.renderCustomBlock}}
                                          {{yield cell to='data-cell'}}
                                        {{else}}
                                          {{! TODO: This should be based on the type of the field }}
                                          {{#if cell.rowLink}}
                                            <td>
                                              <LinkTo
                                                @route={{cell.rowLink}}
                                                @model={{cell.rowLinkModel}}
                                                style='display: inline-block; width: 100%; height: 100%; margin: 0; padding: 0;'
                                              >
                                                {{cell.value}}
                                              </LinkTo>
                                            </td>
                                          {{else}}
                                            <td>{{cell.value}}</td>
                                          {{/if}}
                                        {{/if}}
                                      </dataCells.DataCell>
                                    {{/each}}
                                  {{/if}}
                                </row.DataCells>
                                {{#if (has-block 'actions')}}
                                  {{yield row to='actions'}}
                                {{else}}
                                  {{#if row.linkedRoutes}}
                                    <td>
                                      {{#each
                                        row.linkedRoutes
                                        as |linkedRoute|
                                      }}
                                        {{#if linkedRoute.icon}}
                                          {{! NOTE: Change if icons should be supported, use rawIcon if icon name contain _ }}
                                          {{! NOTE: keep the label intact for screenreaders }}
                                          <LinkTo
                                            @route={{linkedRoute.route}}
                                            @model={{linkedRoute.model}}
                                          >
                                            {{or
                                              linkedRoute.label
                                              linkedRoute.route
                                            }}
                                          </LinkTo>
                                        {{else}}
                                          <LinkTo
                                            @route={{linkedRoute.route}}
                                            @model={{linkedRoute.model}}
                                          >
                                            {{or
                                              linkedRoute.label
                                              linkedRoute.route
                                            }}
                                          </LinkTo>
                                        {{/if}}
                                      {{/each}}
                                    </td>
                                  {{/if}}
                                {{/if}}
                              </ClickableRow>
                            {{/if}}
                          </body.Row>
                        {{/each}}
                      {{else}}
                        {{#if (has-block 'no-data-message')}}
                          {{yield to='no-data-message'}}
                        {{else}}
                          <tr><td colspan='100%' class='no-data-message'><p
                              >{{@noDataMessage}}</p></td></tr>
                        {{/if}}
                      {{/if}}
                    {{/if}}
                  </tbody>
                {{/if}}
              </content.Body>
              {{! END: body }}
            </table>
          </div>
        {{/if}}
      </dt.Content>
      {{! END: content }}

      {{! START: pagination }}
      <dt.Pagination as |pagination|>
        {{#if (has-block 'pagination')}}
          {{yield pagination to='pagination'}}
        {{else}}
          <div class='data-table-pagination'>
            <div class='data-table-pagination-left'>
              Displaying
              {{pagination.startIndex}}-{{pagination.endIndex}}
              {{#if pagination.hasTotal}} of {{pagination.total}}{{/if}}
              {{#if pagination.sizeOptions}}
                |
                <label>
                  <select
                    {{on 'change' pagination.selectSizeOption}}
                    value='target.value'
                  >
                    {{#each pagination.sizeOptions as |sizeOption|}}
                      <option
                        value={{sizeOption}}
                        selected={{eq pagination.pageSize sizeOption}}
                      >{{sizeOption}}</option>
                    {{/each}}
                  </select>
                  per page
                </label>
              {{/if}}
            </div>
            {{#if pagination.hasMultiplePages}}
              <div class='data-table-pagination-right'>
                <button
                  disabled={{pagination.isFirstPage}}
                  type='button'
                  {{on
                    'click'
                    (fn (mut pagination.humanPage) pagination.firstPage)
                  }}
                >First</button>
                <button
                  disabled={{pagination.isFirstPage}}
                  type='button'
                  {{on
                    'click'
                    (fn (mut pagination.humanPage) pagination.previousPage)
                  }}
                >Previous</button>

                <button
                  disabled={{pagination.isLastPage}}
                  type='button'
                  {{on
                    'click'
                    (fn (mut pagination.humanPage) pagination.nextPage)
                  }}
                >Next</button>
                <button
                  disabled={{pagination.isLastPage}}
                  type='button'
                  {{on
                    'click'
                    (fn (mut pagination.humanPage) pagination.lastPage)
                  }}
                >Last</button>
              </div>
            {{/if}}
          </div>
        {{/if}}
      </dt.Pagination>
      {{! END: pagination }}
    </div>
  </DataTable>
</template>
