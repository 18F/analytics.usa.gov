# Snippet Builder
This is a client-side [DAP](https://github.com/GSA/DAP-Gov-wide-GA-Code) JavaScript snippet packager.
It basically follows [these steps](https://github.com/GSA/analytics.usa.gov/blob/master/dap.md):

1. Download [the original DAP snippet](https://github.com/GSA/DAP-Gov-wide-GA-Code/blob/master/Universal-Federated-Analytics.1.0.js)
2. Minify it and create a [source map](http://www.html5rocks.com/en/tutorials/developertools/sourcemaps/) with [uglify-js](https://www.npmjs.com/package/uglify-js)
3. Gzip the original, minified and source map files.
4. Provide a download link for all 6 files: the original, minified and source map; in both text and gzipped version.

To build the browser-ready JavaScript bundle you'll need to:

1. `npm install` to install the dependencies
2. run `make -B` (or `make clean all`) to build `js/bundle.js` and `js/bundle.min.js`
3. run `npm run watch` to have the files built automatically whenever the source changes
