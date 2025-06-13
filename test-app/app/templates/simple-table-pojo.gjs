import { fn } from '@ember/helper';

import RawDataTable from 'ember-data-table/components/raw-data-table';
import pageTitle from 'ember-page-title/helpers/page-title';

<template>
  {{pageTitle "Simple table + objects"}}

  <div class="layout-row flex layout-align-center">
    <div class="container">
      <h1 id="title">Ember Data Table with simple object elements</h1>
      <blockquote>Generated table header and body based on given
        <code>fields</code>
        without any configuration. Using simple objects as data.</blockquote>
      <RawDataTable
        @content={{@model}}
        @fields="firstname lastname age created modified"
        @isLoading={{@controller.isLoadingModel}}
        @filter={{@controller.filter}}
        @sort={{@controller.sort}}
        @page={{@controller.page}}
        @size={{@controller.size}}
        @updateFilter={{fn (mut @controller.filter)}}
        @updateSort={{fn (mut @controller.sort)}}
        @updatePage={{fn (mut @controller.page)}}
        @updatePageSize={{fn (mut @controller.size)}}
      />
    </div>
  </div>
</template>
