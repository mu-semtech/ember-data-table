import { hash } from '@ember/helper';

import DataTableThSortable from './th-sortable.gjs';
/* Used in: data-table/content */
<template>
  {{yield
    (hash
      enableSelection=@enableSelection
      enableLineNumbers=@enableLineNumbers
      sort=@sort
      updateSort=@updateSort
      hasLinks=@hasLinks
      customHeaders=@customHeaders
      fields=@fields
      dataHeadersInfo=(hash
        fields=@fields
        customHeaders=@customHeaders
        sort=@sort
        updateSort=@updateSort
      )
      ThSortable=(component
        DataTableThSortable fields=@fields sort=@sort updateSort=@updateSort
      )
    )
  }}
</template>
