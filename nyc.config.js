"use strict";

/**
 * Configures the code coverage tool NYC.
 */
module.exports = {
  all: true,
  exclude: [
    "_site",
    "assets",
    "coverage",
    "eslint.config.js",
    "gulp",
    "gulpfile.js",
    "nyc.config.js",
    "node_modules",
    "webpack.config.js",
  ],
  branches: 100,
  functions: 100,
  lines: 100,
  statements: 100,
};
