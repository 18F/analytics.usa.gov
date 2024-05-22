const { configs: eslintConfigs } = require("@eslint/js");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const globals = require("globals");
const reactRecommended = require("eslint-plugin-react/configs/recommended");

module.exports = [
  {
    languageOptions: {
      globals: {
        ga: false,
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    // Include recommended linting rules from eslint, react, and prettier
    //
    // When linting ignore the locally compiled minified JS, other assets, and
    // touchpoints JS which is third party code copied into this repo.
    ignores: [
      "_site/**/*.js",
      "assets/**/*",
      "sass/**/*",
      "ga4-data/**/*",
      "js/lib/touchpoints.js",
    ],
    ...eslintConfigs.recommended,
    ...reactRecommended,
    ...eslintPluginPrettierRecommended,
  },
];
