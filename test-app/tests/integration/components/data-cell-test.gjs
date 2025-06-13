import { tracked } from '@glimmer/tracking';
import { renderSettled } from '@ember/renderer';
import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';

import RawDataTable from 'ember-data-table/components/raw-data-table';

module('Integration | Component | data-table/data-cell', function (hooks) {
  setupRenderingTest(hooks);

  const onePerson = [{ firstName: 'John', lastName: 'Doe', age: 20 }];
  const allFields = ['firstName', 'lastName', 'age'];

  test('it renders custom fields as custom', async function (assert) {
    class Context {
      @tracked customFields;
    }

    const context = new Context();

    context.customFields = 'age notExisting';
    await render(
      <template>
        <RawDataTable
          @content={{onePerson}}
          @fields={{allFields}}
          @customFields={{context.customFields}}
        >
          <:data-cell as |cell|>
            <td>{{cell.attribute}}</td>
          </:data-cell>
        </RawDataTable>
      </template>,
    );

    assert
      .dom('tbody>tr:first-child td')
      .exists({ count: 3 }, 'displays 3 columns');
    assert
      .dom('tbody>tr:first-child td:first-child')
      .hasText('John', 'displays firstName in first column');
    assert
      .dom('tbody>tr:first-child td:nth-child(2)')
      .hasText('Doe', 'displays lastName in second column');
    assert
      .dom('tbody>tr:first-child td:nth-child(3)')
      .hasText('age', 'displays custom block in third column');
    assert
      .dom('tbody')
      .doesNotIncludeText('20', 'Only display custom block, not the age value');
    assert
      .dom('tbody')
      .doesNotIncludeText(
        'notExisting',
        'only show @customFields custom blocks for fields also passed to @fields',
      );

    context.customFields = 'firstName';
    await renderSettled();
    assert
      .dom('tbody>tr:first-child td')
      .exists({ count: 3 }, 'reactivity: displays 3 columns');
    assert
      .dom('tbody>tr:first-child td:first-child')
      .hasText(
        'firstName',
        'reactivity: displays custom block in first column',
      );
    assert
      .dom('tbody>tr:first-child td:nth-child(2)')
      .hasText('Doe', 'reactivity: displays lastName in second column');
    assert
      .dom('tbody>tr:first-child td:nth-child(3)')
      .hasText('20', 'reactivity: displays age in third column');
    assert
      .dom('tbody')
      .doesNotIncludeText(
        'John',
        'reactivity: Only display custom block, not the firstName value',
      );
  });

  test('it renders custom fields as components', async function (assert) {
    class Context {
      @tracked customFields;
    }

    const context = new Context();

    context.customFields = {
      firstName: <template>
        <td>customComponent:{{@cell.attribute}}</td>
      </template>,
      age: '',
    };
    await render(
      <template>
        <RawDataTable
          @content={{onePerson}}
          @fields={{allFields}}
          @customFields={{context.customFields}}
        >
          <:data-cell as |cell|>
            <td>custom:{{cell.attribute}}</td>
          </:data-cell>
        </RawDataTable>
      </template>,
    );

    assert
      .dom('tbody>tr:first-child td')
      .exists({ count: 3 }, 'displays 3 columns');
    assert
      .dom('tbody>tr:first-child td:first-child')
      .hasText(
        'customComponent:firstName',
        'displays firstName custom block in first column',
      );
    assert
      .dom('tbody>tr:first-child td:nth-child(2)')
      .hasText('Doe', 'displays lastName in second column');
    assert
      .dom('tbody>tr:first-child td:nth-child(3)')
      .hasText('custom:age', 'displays custom component in third column');
    assert
      .dom('tbody')
      .doesNotIncludeText('20', 'Only display custom block, not the age value');
    assert
      .dom('tbody')
      .doesNotIncludeText(
        'John',
        'Only display custom component, not firstName value',
      );

    context.customFields = {
      firstName: <template>
        <td>customComponentNew:{{@cell.attribute}}</td>
      </template>,
      age: '',
    };
    await renderSettled();
    assert
      .dom('tbody>tr:first-child td')
      .exists({ count: 3 }, 'reactivity: displays 3 columns');
    assert
      .dom('tbody>tr:first-child td:first-child')
      .hasText(
        'customComponentNew:firstName',
        'reactivity: displays firstName custom block in first column',
      );
    assert
      .dom('tbody>tr:first-child td:nth-child(2)')
      .hasText('Doe', 'reactivity: displays lastName in second column');
    assert
      .dom('tbody>tr:first-child td:nth-child(3)')
      .hasText(
        'custom:age',
        'reactivity: displays custom component in third column',
      );
    assert
      .dom('tbody')
      .doesNotIncludeText(
        '20',
        'reactivity: Only display custom block, not the age value',
      );
    assert
      .dom('tbody')
      .doesNotIncludeText(
        'John',
        'reactivity: Only display custom component, not firstName value',
      );
  });
});
