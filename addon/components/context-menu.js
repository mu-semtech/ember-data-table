import Ember from 'ember';
import layout from '../templates/components/context-menu';

export default Ember.Component.extend({
  layout: layout,
  target: Ember.computed('elementId', function() {
    return `#${this.get('elementId')}`;
  }),
  targetAttachment: 'top right',
  attachment: 'top right',
  showMenu: false,
  actions: {
    openMenu() {
      this.set('showMenu', true);
      return false;
    },
    closeMenu() {
      this.set('showMenu', false);
      return false;
    }
  }
});
