import { array, get } from '@ember/helper';

<template>
  <h2>Person details</h2>
  <ul>
    {{#each
      (array "firstname" "lastname" "age" "created" "modified")
      as |attr|
    }}
      <li>{{attr}}: {{get @model attr}}</li>
    {{/each}}
  </ul>
</template>
