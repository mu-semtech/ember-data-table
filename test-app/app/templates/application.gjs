import { LinkTo } from '@ember/routing';

<template>
  <ul>
    <li><LinkTo @route="simple-table-ed">Simple table (ember-data)</LinkTo></li>
    <li><LinkTo @route="simple-table-pojo">Simple table (objects)</LinkTo></li>
    <li><LinkTo @route="adv-table-ed">Advanced table (ember-data)</LinkTo></li>
    <li><LinkTo @route="adv-table-pojo">Advanced table (objects)</LinkTo></li>
  </ul>

  {{outlet}}
</template>
