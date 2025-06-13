import { hash } from '@ember/helper';

import DataTableDataTableMenuGeneral from './menu-general.gjs';
import DataTableDataTableMenuSelected from './menu-selected.gjs';

/* Used in: data-table.hbs */
<template>
  {{#let
    (component DataTableDataTableMenuGeneral dataTable=@dataTable)
    (component DataTableDataTableMenuSelected dataTable=@dataTable)
    as |general selected|
  }}
    {{yield
      (hash
        General=general
        Selected=selected
        enableSelection=@dataTable.enableSelection
      )
    }}
  {{/let}}
</template>
