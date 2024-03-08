/* gulpfile.js */

const setup = require("./gulp/uswds-setup");

/**
 * Import uswds-compile
 */
const uswds = require("@uswds/compile");

/**
 * USWDS version
 * Set the major version of USWDS you're using
 * (Current options are the numbers 2 or 3)
 */
uswds.settings.version = 3;

/**
 * Path settings
 * Set as many as you need
 */
uswds.paths.dist.css = "./css";
uswds.paths.dist.theme = "./sass";

/**
 * Export gulp tasks
 *
 */
exports.copyAssets = setup.copyUswdsAssets;
exports.compile = uswds.compile;
exports.watch = uswds.watch;
