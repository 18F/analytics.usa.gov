## Public analytics

A collaboration to publish government website analytics.

### Building the Stylesheets

* Install [Sass](http://sass-lang.com/), Bourbon, and Neat:

```bash
gem install sass bourbon neat
```

* To watch the Sass source for changes and build the stylesheets automatically, run:

```bash
make watch
```

* To compile the Sass stylesheets once, run:

```bash
make clean all
```

or:

```bash
# -B tells make to run even if the .css file exists
make -B
```

* To serve the site locally for testing, run:

```bash
make serve
```

Then navigate to localhost:8000 in your browser of choice

### Deploying the app

To deploy this app to `analytics.usa.gov`, you will need authorized access to 18F's Amazon S3 bucket for the project.

If using `s3cmd`, the command to deploy the site with a **5 minute cache time** is:

```bash
s3cmd put --recursive -P --add-header="Cache-Control:max-age=300" _site/* s3://18f-dap/
```

This deploys `index.html`, and the relevant static assets, to the bucket.

### Fixing links in the Top 20

Links pulled directly from Google Analytics are occasionally broken (this is most common in the Top 20 section). For now, we're hard coding the fix in the `index.js` file [here](https://github.com/GSA/analytics.usa.gov/blob/master/js/index.js#L6) in the format: `"broken link" : "working link",`.

### Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
