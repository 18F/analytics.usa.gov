## Hosting the DAP Snippet

This project hosts a copy of the official Google Analytics snippet for the Digital Analytics Program ("the DAP").

It is used by this project to report its own analytics to the DAP.

This document shows how to download, minify, and compress the DAP, and generate a source map for debugging.

To follow along with these instructions, you'll need:

* Node and `npm`.
* The `gzip` command line tool for compressing files. Comes standard on Linux.
* The `s3cmd` command line tool for pushing files to Amazon S3.
* Authorized access to the `analytics.usa.gov` S3 bucket.

### Getting the official snippet

Download the current, unminified DAP snippet to `dap.js` from its [GitHub repository](https://github.com/GSA/DAP-Gov-wide-GA-Code):

```bash
wget https://raw.githubusercontent.com/GSA/DAP-Gov-wide-GA-Code/master/Universal-Federated-Analytics.1.0.js
mv Universal-Federated-Analytics.1.0.js dap.js
```

Don't append a version number to the filename `dap.js` - the intent is for this file to be upgraded in place whenever DAP changes.

If DAP ever needs to make a backwards-incompatible change that requires notice to implementing agencies for them to update their snippet, the filename can be revisited.


### Minifying

Generate a minified version of the snippet, and an accompanying [source map](https://developer.chrome.com/devtools/docs/javascript-debugging#source-maps), using [`uglifyjs`](http://lisperator.net/uglifyjs/).

Install `uglifyjs` through `npm` (which comes with [Node](http://nodejs.org)):

```bash
npm install -g uglify-js
```

Then run it, specifying the source map:

```bash
uglifyjs dap.js --source-map=dap.min.js.map > dap.min.js
```

This gives you three files: `dap.js`, `dap.min.js` (minified), and `dap.min.js.map` (source map).

### Compressing

Most file servers will automatically bake compression (gzip) into the process, automatically compressing them as needed (this is called [compression scheme negotiation](https://en.wikipedia.org/wiki/HTTP_compression#Compression_scheme_negotiation)). Amazon S3 **does not do this**, so we need to compress the files ourselves.

Create a compressed (gzipped) version of all 3 files:

```bash
gzip -c dap.min.js > dap.min.js.gz
gzip -c dap.min.js.map > dap.min.js.map.gz
gzip -c dap.js > dap.js.gz
```

### Uploading

Upload each gzipped file to the Amazon S3 bucket, using [`s3cmd`](https://github.com/s3tools/s3cmd).

The below commands instruct Amazon S3 to serve files as JavaScript, and to mark their encoding as `gzip`, so that browsers will know to automatically unzip the files before reading them. Note that **the files are renamed upon upload** to remove the `.gz` suffix.

```
s3cmd put -P --mime-type="application/javascript" --add-header="Content-Encoding: gzip" --add-header="Cache-Control:max-age=3600" dap.js.gz s3://18f-dap/dap/dap.js
s3cmd put -P --mime-type="application/javascript" --add-header="Content-Encoding: gzip" --add-header="Cache-Control:max-age=3600" dap.min.js.gz s3://18f-dap/dap/dap.min.js
s3cmd put -P --mime-type="application/javascript" --add-header="Content-Encoding: gzip" --add-header="Cache-Control:max-age=3600" dap.min.js.map.gz s3://18f-dap/dap/dap.min.js.map
```

This bucket is served by CloudFront, at `https://analytics.usa.gov`. So the final URL for the compressed, minified DAP snippet is:

> https://analytics.usa.gov/dap/dap.min.js

### Possible future TODOs

* Look into making a single Node script that does all of this at once, similar to [`analytics-reporter`](https://github.com/18F/analytics-reporter/blob/f2183ded024b58033aa89662fd24b3e3c7533387/bin/analytics).
* Commit the DAP results directly to this repository. This would also mean we could include it in automated webhook-based deployments.
