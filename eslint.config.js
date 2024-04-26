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
    // Ignore the locally built site with minified JS.
    ignores: [
      "_site/**/*.js",
      "assets/**/*",
      "sass/**/*",
      "ga4-data/**/*",
      "js/lib/touchpoints.js",
    ],
    ...reactRecommended,
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
    ...eslintPluginPrettierRecommended,
  },
];
