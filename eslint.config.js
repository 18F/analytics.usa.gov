const { configs: eslintConfigs } = require("@eslint/js");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const globals = require("globals");

module.exports = [
  {
    languageOptions: {
      globals: {
        ga: false,
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
      },
    },
  },
  {
    // Ignore the locally built site with minified JS.
    ignores: [
      "_site/**/*.js",
      "assets/**/*",
      "sass/**/*",
      "ga4-data/**/*",
      "js/lib/touchpoints.js",
    ],
    ...eslintConfigs.recommended,
  },
  {
    ignores: [
      "_site/**/*.js",
      "assets/**/*",
      "sass/**/*",
      "ga4-data/**/*",
      "js/lib/touchpoints.js",
    ],
    ...eslintPluginPrettierRecommended,
  },
];
