const { configs: eslintConfigs } = require("@eslint/js");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const globals = require("globals");
const jsxA11y = require("eslint-plugin-jsx-a11y");
const jsdoc = require("eslint-plugin-jsdoc");
const reactRecommended = require("eslint-plugin-react/configs/recommended");

module.exports = [
  {
    languageOptions: {
      globals: {
        ga: false,
        gas4: false,
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
    ...eslintConfigs.recommended,
    ignores: [
      "_site/**/*",
      "assets/**/*",
      "sass/**/*",
      "ga4-data/**/*",
      "js/lib/touchpoints_feedback_modal.js",
      "js/lib/touchpoints_page_helpful_survey.js",
    ],
  },
  {
    ignores: [
      "_site/**/*",
      "assets/**/*",
      "sass/**/*",
      "ga4-data/**/*",
      "js/lib/touchpoints_feedback_modal.js",
      "js/lib/touchpoints_page_helpful_survey.js",
    ],
    settings: {
      react: {
        version: "detect",
      },
    },
    plugins: {
      ...reactRecommended.plugins,
    },
    rules: {
      ...reactRecommended.rules,
    },
  },
  {
    plugins: {
      "jsx-a11y": jsxA11y,
    },
    ignores: [
      "_site/**/*",
      "assets/**/*",
      "sass/**/*",
      "ga4-data/**/*",
      "js/lib/touchpoints_feedback_modal.js",
      "js/lib/touchpoints_page_helpful_survey.js",
    ],
    rules: {
      ...jsxA11y.configs.recommended.rules,
      // This doesn't allow anchor tags without HREF attributes, which are
      // sometimes required to avoid other accessibility concerns like needing
      // non-focusable buttons.
      "jsx-a11y/anchor-is-valid": "off",
    },
  },
  {
    ...eslintPluginPrettierRecommended,
    ignores: [
      "_site/**/*",
      "assets/**/*",
      "sass/**/*",
      "ga4-data/**/*",
      "js/lib/touchpoints_feedback_modal.js",
      "js/lib/touchpoints_page_helpful_survey.js",
    ],
  },
  {
    plugins: {
      jsdoc,
    },
    ignores: [
      "_site/**/*",
      "assets/**/*",
      "sass/**/*",
      "ga4-data/**/*",
      "js/lib/touchpoints_feedback_modal.js",
      "js/lib/touchpoints_page_helpful_survey.js",
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
