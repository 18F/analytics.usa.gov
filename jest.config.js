const { defaults } = require("jest-config");

/**
 * @type {import('jest').Config}
 */
const config = {
  collectCoverage: true,
  collectCoverageFrom: ["js/**/*.js"],
  coverageDirectory: "./coverage",
  setupFiles: ["./jest_setup.js"],
  testEnvironment: "jest-environment-jsdom",
  transformIgnorePatterns: [],
};

module.exports = config;
