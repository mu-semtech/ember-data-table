export default {
  plugins: ['prettier-plugin-ember-template-tag'],
  overrides: [
    {
      files: '*.{js,ts,gjs}',
      options: {
        singleQuote: true,
        templateSingleQuote: false,
      },
    },
  ],
};
