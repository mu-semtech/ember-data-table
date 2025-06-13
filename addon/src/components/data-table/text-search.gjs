import Component from '@glimmer/component';
import { hash } from '@ember/helper';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';

/* Used in: data-table.hbs */
export default class TextSearchComponent extends Component {
  <template>
    {{yield
      (hash
        filter=@filter
        placeholder=@placeholder
        autoSearch=@autoSearch
        submitForm=this.submitForm
        handleInput=this.handleInput
        handleAutoInput=this.handleAutoInput
        handleDirectInput=this.handleDirectInput
      )
    }}
  </template>
  enteredValue = undefined;

  debouncedSubmit = restartableTask(async () => {
    await timeout(this.args.searchDebounceTime);
    this.args.updateFilter(this.enteredValue);
  });

  @action
  handleAutoInput(event) {
    this.enteredValue = event.target.value;
    this.debouncedSubmit.perform();
  }

  @action
  handleInput(event) {
    this.enteredValue = event.target.value;

    if (this.args.autoSearch !== false) {
      this.debouncedSubmit.perform();
    }
  }

  submitCurrent() {
    this.args.updateFilter(this.enteredValue);
  }

  @action
  handleDirectInput(event) {
    this.enteredValue = event.target.value;
  }

  @action
  submitForm(event) {
    event.preventDefault();
    this.submitCurrent();
  }
}
