/**
 * Import Gulp
 */
const { src, dest, series } = require("gulp");

/**
 * Paths
 */

const USWDS = "node_modules/@uswds/uswds/dist";
const ASSETS = "assets/uswds"

/**
 * Copy USWDS 3 assets for build
 *
 * */

function copyUswdsJS() {
  return src(`${USWDS}/js/**/*`).pipe(dest(`${ASSETS}/js`));
}

function copyUswdsFonts() {
  return src(`${USWDS}/uswds/dist/fonts/**/**`).pipe(dest(`${ASSETS}/fonts`));
}

function copyUswdsImages() {
  return src(`${USWDS}/uswds/dist/img/**/**`).pipe(dest(`${ASSETS}/img`));
}



/**
 * Export Tasks
 * 
 */

exports.copyUswdsAssets = series(copyUswdsJS, copyUswdsFonts, copyUswdsImages);






