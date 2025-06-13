'use strict';

const sideWatch = require('@embroider/broccoli-side-watch');
const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    sassOptions: {
      precision: 4,
      includePaths: [
        '../node_modules/ember-data-table/dist/styles',
      ],
    },
    'ember-cli-babel': {
      includePolyfill: true,
    },
    minifyCSS: {
      options: {
        advanced: false,
      },
    },
    trees: {
      // automatically watch the addon when running the test-app, so it gets rebuilt when the addon code is updated
      app: sideWatch('app', { watching: [
        'ember-data-table', // this will resolve the package by name and watch all its importable code

        ] }),
    },
  });

  const { maybeEmbroider } = require('@embroider/test-setup');

  return maybeEmbroider(app, {
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
  });
};
