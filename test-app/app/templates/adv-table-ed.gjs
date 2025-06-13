import { array, fn, hash } from '@ember/helper';
import { on } from '@ember/modifier';

import RawDataTable from 'ember-data-table/components/raw-data-table';
import pageTitle from 'ember-page-title/helpers/page-title';
import eq from 'ember-truth-helpers/helpers/eq';

import Allcaps from '../components/allcaps';
import lastItem from '../helpers/lastItem';

<template>
  {{pageTitle "Advanced table + ember-data"}}
  <div class="layout-row flex layout-align-center">
    <div class="container">
      <h1 id="title">
        Advanced usage of Ember Data Table with Ember-Data elements
      </h1>
      <blockquote>
        Data Table with multiple configurations active. Using ember-data data.
      </blockquote>
      <RawDataTable
        @content={{@model}}
        @isLoading={{@controller.isLoadingModel}}
        @filter={{@controller.filter}}
        @sort={{@controller.sort}}
        @page={{@controller.page}}
        @size={{@controller.size}}
        @sizes={{array "5" 10 "15" 20}}
        @updateFilter={{fn (mut @controller.filter)}}
        @updateSort={{fn (mut @controller.sort)}}
        @updatePage={{fn (mut @controller.page)}}
        @updatePageSize={{fn (mut @controller.size)}}
        @fields={{array
          "firstname:First_Name"
          (hash attribute="lastname" label="Last Name")
          "age:not-used-header"
          "created"
          "modified"
        }}
        @sortableFields={{array "firstname" "lastname" "age"}}
        @searchPlaceholder="Type to search automatically"
        @autoSearch={{500}}
        @enableLineNumbers={{true}}
        @enableSelection={{true}}
        @links={{array
          (hash route="person" label="view person")
          "person-details:view_person_details"
        }}
        @linksModelProperty=""
        @customHeaders={{array "age" "created"}}
        @customFields={{hash firstname=(component Allcaps) lastname=""}}
      >
        <:data-header as |header|>
          {{#if (eq header.attribute "age")}}
            <th>Age</th>
          {{else if (eq header.attribute "created")}}
            <th>Creation date</th>
          {{/if}}
        </:data-header>
        <:data-cell as |cell|>
          {{#if (eq cell.attribute "lastname")}}
            <Allcaps @cell={{cell}} />
          {{/if}}
        </:data-cell>
        <:selection-menu-actions as |menu|>
          <button
            type="button"
            {{on
              "click"
              (fn
                menu.dataTable.removeItemFromSelection (lastItem menu.selection)
              )
            }}
          >
            Clear last selection
          </button>
        </:selection-menu-actions>
        <:action-header>
          Links
        </:action-header>
        <:no-data-message>
          ---- No Data Found ----
        </:no-data-message>
      </RawDataTable>
    </div>
  </div>
</template>
