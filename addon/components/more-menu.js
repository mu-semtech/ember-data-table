import Ember from 'ember';
import layout from '../templates/components/more-menu';

export default Ember.Component.extend({
  layout,
  classNames: ['dropdown-button'],

  didRender() {
    this._super(...arguments);
    this._setupDropdown();
  },

  _setupDropdown() {
    // needed until the Materialize.dropdown plugin is replaced
    this.$().attr('data-activates', this.get('_dropdownContentId'));
    this.$().dropdown({
      belowOrigin: false,
      alignment: 'right',
      constrain_width: false,
      gutter: 100
    });
  },
  
  _dropdownContentId: Ember.computed(function() {
    return `${this.get('elementId')}-dropdown-content`;
  })
});
