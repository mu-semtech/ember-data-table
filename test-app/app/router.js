import EmberRouter from '@ember/routing/router';

import config from 'test-app/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('simple-table-ed');
  this.route('simple-table-pojo');
  this.route('adv-table-ed');
  this.route('adv-table-pojo');
  this.route('person', { path: '/people/:id/' });
  this.route('person-details', { path: '/people-details/:id/' });
});
