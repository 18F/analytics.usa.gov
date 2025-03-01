![Build Status](https://github.com/18F/analytics.usa.gov/actions/workflows/ci.yml/badge.svg?branch=master)
[![Snyk](https://snyk.io/test/github/18F/analytics.usa.gov/badge.svg)](https://snyk.io/test/github/18F/analytics.usa.gov)

## analytics.usa.gov

Analytics.usa.gov is a product of the [Digital Analytics Program (DAP)](https://github.com/digital-analytics-program/gov-wide-code),
which collects and publishes web analytics from thousands of public-facing US
federal government websites per the ["Delivering a Digital-First Public Experience"](https://www.whitehouse.gov/wp-content/uploads/2023/09/M-23-22-Delivering-a-Digital-First-Public-Experience.pdf)
requirement built in support of the 21st Century Integrated Digital Experience Act (IDEA). 

The process for adding features to this project is described in
[Development and deployment process](docs/development_and_deployment_process.md).

## About the components

Ths app uses [Jekyll](https://jekyllrb.com) to build the site, and [Sass](https://sass-lang.com/)
for CSS.  Javascript provided is a [webpacked](https://webpack.js.org/)
aggregation of [several different modules](#javascript-modules), leveraging
[React](https://react.dev/) and [d3](https://d3js.org/) for the visualizations.
[Learn more on the webpack configuration](#webpack-configuration)

This is the main repository for https://analytics.usa.gov.
Additional repositories are:

* https://github.com/18f/analytics-reporter
* https://github.com/18f/analytics-reporter-api

## Developing locally

### Prerequisites

* [Ruby 3.3.6](https://www.ruby-lang.org/en/)
* [NodeJS 22.x.x](https://nodejs.org/en)

Install ruby and node libraries before attempting to run other development
commands:

```bash
# Install dependencies
bundle install
npm install
```

### Build and serve the site on your local machine

```bash
# Compile and serve the full site locally, watching for changes.
npm start
```

### Running the linters

Linters run on the static files for the repo and ensure that the code is free
from syntax issues and that code style conforms to community best practices.
These checks are also enforced in CI where possible. Run the linters with the
following commands:

```bash
# JavaScript
npm run lint:js
```

```bash
# SCSS
npm run lint:styles
```

```bash
# HTML
npm run lint:html
```

You can add `:fix` to any above the above commands and the linter will attempt
to automatically fix common lint issues.

### Run the unit tests

Unit tests ensure that code works as expected and can be helpful in finding
bugs. These tests are also enforced to pass via CI. Run the unit tests with the
following command:

```bash
npm test
```

### Install git hooks

There are git hooks provided in the `./hooks` directory to help with common
development tasks. These will checkout current NPM packages on branch change
events, and run the linters and unit tests on pre-commit.

Install the provided hooks with the following command:

```bash
npm run install-git-hooks
```

Now the site will be served at http://localhost:4000 and will be reloaded if you
make changes to the source files locally.

### Check for accessibility issues

With the site running locally, you can test for accessiblity issues with [pa11y](https://github.com/pa11y/pa11y)
or with [Axe](https://github.com/dequelabs/axe-core-npm)

```bash
# Run the site locally
npm start

# Run pa11y checks
npm run accessibility:pa11y

# Run axe checks
npm run accessibility:axe
```

You can update the URL in the script definition to run pa11y for other pages. By
default pa11y runs on the http://localhost:4000/ page.

### Developing with local data

The development settings assume data is available at `/ga4-data`. You can change
this in `_development.yml`.

### Developing with real live data from `analytics-reporter`

If also working off of local data, e.g. using `analytics-reporter`, you will
need to make the data available over HTTP _and_ through CORS.

Various tools can do this. This project recommends using the Node module `serve`:

```bash
npm install -g serve
```

Generate data to a directory:

```
analytics --output [dir]
```

Then run `serve` from the output directory:

```bash
serve --cors
```

The data will be available at `http://localhost:4000` over CORS, with no path
prefix. For example, device data will be at `http://localhost:4000/devices.json`.

### Adding Additional Agencies

1. Ensure that data is being collected for a specific agency's Google Analytics
ID. Visit [18F's analytics-reporter](https://github.com/18F/analytics-reporter)
for more information. Save the url path for the data collection path.
1. Create a new json object in the `/_data/agencies.json` file. The `slug`
attribute of the object will be the url path. The `name` attribute is the
agency's display name.

### Javascript Modules

* **Index** - The entry point for the webpack bundler. This pulls in all React
component JS to make it available for rendering.
* **js/components** the top level directory containing all React component
definitions. The components which render charts contain the d3 logic for
rendering the chart within them. Since this is not a full react app due to
many pages being generated statically by Jekyll, there are index.js files within
some component directories to run createRoot from the react-dom library to
inject React components at certain elements
* **lib/chart_helpers** helper functions containing d3 logic which is shared
between multiple charts.
* **lib/touchpoints.js** third party code from the [Touchpoints](https://touchpoints.app.cloud.gov/)
project integration, included in this repo to avoid Content Security Policy
problems from remote-hosted scripts.

### Deploying the app

Production, staging, and dev applications are deployed via CI automatically. Any
commits to the `master` branch will be deployed to production after passing
automated tests in CI. Any commits to the `staging` branch will be deployed to
the staging environment. Any commits to the `develop` branch will be deployed to
the development environment.

It shouldn't be necessary to deploy manually, but with the Cloud Foundry CLI
installed, follow these steps to deploy.

To deploy to **analytics.usa.gov** after building the site with the details in
`_config.yml`:

```bash
make deploy_production
```

To deploy to **analytics-staging.app.cloud.gov** after building the site with
the details in `_config.yml` and `_staging.yml`:

```bash
make deploy_staging
```

### Environments

| Environment | Branch | URL |
|-------------| ------ | --- |
| Production | master | https://analytics.usa.gov |
| Staging | staging | https://analytics-staging.app.cloud.gov |
| Development | develop | https://analytics-develop.app.cloud.gov |

#### API key

The historical data downloads page of the site makes API calls (proxied through
the site's NGINX server) to the DAP API (handled by the analytics-reporter-api
application) which include an api.data.gov API key. This key is provided as
configuration by CI during deployment and can be updated as needed in the CI
deployment variables.

### Webpack Configuration

The application compiles es6 modules into web friendly js via Wepback and the
[babel loader](https://webpack.js.org/loaders/babel-loader/).

The webpack configuration is set in the [wepback.config.js](./webpack.config.js).

The current configuration uses babel `present-env`.

The webpack also includes linting using [eslint](https://eslint.org/) leveraging
[Prettier](https://prettier.io/), as well as community recommended style
guidlines for eslint and react.

The webconfig uses the [TerserWebpackPlugin](https://webpack.js.org/plugins/terser-webpack-plugin/)
to minimize the bundle.

The resulting uglified bundle is built into `assest/bundle.js`.

#### NPM webpack commands

| Command | purpose |
|-------------| ------ |
| npm run build:local | a watch command rebuilding the webpack with a development configuration (i.e. no minifiecation) |
| npm run build:prod | a webpack command to build a minified and transpiled bundle.js |

### Usage by other organizations

Other organizations who have reused this project for their analytics dashboard:

|                                                                       |                                                                                        |
|:---------------------------------------------------------------------:|:--------------------------------------------------------------------------------------:|
| [The City of Anchorage, AK](https://analytics.muni.org/)              | [The City of Omaha, NE](https://analytics.cityofomaha.org/) |
| [The City of Sacramento, CA](https://analytics.cityofsacramento.org/) | [Carbarrus County, NC](http://analytics.cabarruscounty.us/) |
| [Cook County, IL](http://opendocs.cookcountyil.gov/analytics/)        | [City of Seattle](https://www.seattle.gov/about-our-digital-properties/web-analytics) |
| [Douglas County, NE](http://analytics.douglascounty-ne.gov/)          | [Washington State University](https://analytics.wsu.edu/) |
| [State of Indiana](https://analytics.in.gov/)                         | [U.S. Department of Education](http://www2.ed.gov/analytics) |
| [State of Georgia](https://analytics.georgia.gov/)                    | [USA.gov - General Services Administration](https://www.usa.gov/website-analytics/) |

[This blog post details their implementations and lessons learned](https://18f.gsa.gov/2016/01/05/tips-for-adapting-analytics-usa-gov/).

### Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in
[CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright
> and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication.
> By submitting a pull request, you are agreeing to comply with this waiver of
> copyright interest.
