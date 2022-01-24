import { action } from '@ember/object';
import { cancel, debounce } from '@ember/runloop';
import Component from '@glimmer/component';

export default class TextSearchComponent extends Component {
  enteredValue = undefined;

  autoDebouncePid = undefined;

  @action
  handleAutoInput(event) {
    this.enteredValue = event.target.value;
    this.autoDebouncePid = debounce(this, this.submitCurrent, this.args.wait);
  }

  submitCurrent() {
    if( !this.isDestroying && !this.isDestroyed ) {
      this.args.updateFilter( this.enteredValue );
      this.autoDebouncePid = undefined;
    }
  }

  willDestroy() {
    super.willDestroy(...arguments);
    cancel(this.autoDebouncePid);
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
