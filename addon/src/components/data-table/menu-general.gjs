import { hash } from '@ember/helper';

/* Used in: data-table/menu */
<template>
  {{yield
    (hash dataTable=@dataTable selectionIsEmpty=@dataTable.selectionIsEmpty)
  }}
</template>
