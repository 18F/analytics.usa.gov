const { configs: eslintConfigs } = require("@eslint/js");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const globals = require("globals");
const reactRecommended = require("eslint-plugin-react/configs/recommended");
const jsdoc = require("eslint-plugin-jsdoc");

module.exports = [
  {
    languageOptions: {
      globals: {
        ga: false,
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
        ...globals.jest,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  // Include recommended linting rules from eslint, react, and prettier
  //
  // When linting ignore the locally compiled minified JS, other assets, and
  // touchpoints JS which is third party code copied into this repo.
  {
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
    settings: {
      react: {
        version: "detect",
      },
    },
    ...reactRecommended,
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
  {
    plugins: {
      jsdoc,
    },
    ignores: [
      "_site/**/*.js",
      "assets/**/*",
      "sass/**/*",
      "ga4-data/**/*",
      "js/lib/touchpoints.js",
      "**/__tests__/*.js",
    ],
    rules: {
      ...jsdoc.configs.recommended.rules,
      "jsdoc/check-indentation": "error",
      "jsdoc/check-line-alignment": "error",
      "jsdoc/check-syntax": "error",
      "jsdoc/convert-to-jsdoc-comments": "error",
      "jsdoc/no-bad-blocks": "error",
      "jsdoc/no-blank-block-descriptions": "error",
      "jsdoc/no-blank-blocks": "error",
      "jsdoc/require-asterisk-prefix": "error",
      "jsdoc/require-jsdoc": [
        "error",
        {
          checkGetters: false,
          checkSetters: false,
          publicOnly: true,
          require: {
            ArrowFunctionExpression: true,
            ClassDeclaration: true,
            ClassExpression: true,
            FunctionDeclaration: true,
            FunctionExpression: true,
            MethodDefinition: true,
          },
        },
      ],
      "jsdoc/require-throws": "error",
      "jsdoc/sort-tags": "error",
      "jsdoc/tag-lines": "off",
    },
  },
];
