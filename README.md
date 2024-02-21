[![Code Climate](https://codeclimate.com/github/18F/analytics.usa.gov/badges/gpa.svg)](https://codeclimate.com/github/18F/analytics.usa.gov)  [![CircleCI](https://circleci.com/gh/18F/analytics.usa.gov.svg?style=shield)](https://circleci.com/gh/18F/analytics.usa.gov)  [![Dependency Status](https://gemnasium.com/badges/github.com/18F/analytics.usa.gov.svg)](https://gemnasium.com/github.com/18F/analytics.usa.gov)




## analytics.usa.gov

Analytics.usa.gov is a product of the [Digital Analytics Program (DAP)](https://github.com/digital-analytics-program/gov-wide-code), which collects and publishes website analytics from thousands of public-facing US federal government websites as part of the Office of Management and Budget (OMB) "Delivering a Digital-First Public Experience" requirement. 

For a detailed description of how the site works, read [18F's blog post on analytics.usa.gov](https://18f.gsa.gov/2015/03/19/how-we-built-analytics-usa-gov/).

Other organizations who have reused this project for their analytics dashboard:

|                                                                           |                                                                                        |
|:-------------------------------------------------------------------------:|:--------------------------------------------------------------------------------------:|
| [The City of Anchorage, AK](https://analytics.muni.org/)                  | [The City of Boulder, CO](https://bouldercolorado.gov/stats)                           |
| [The City of Los Angeles, CA](http://webanalytics.lacity.org/)            | [The City of Santa Monica, CA](http://analytics.smgov.net/)                            |
| [The City of Omaha, NE](https://analytics.cityofomaha.org/)               | [The City of San Francisco, CA](http://analytics.sfgov.org/)                           |
| [The City of Sacramento, CA](https://analytics.cityofsacramento.org/)     | [Carbarrus County, NC](http://analytics.cabarruscounty.us/)                            |
| [Cook County, IL](http://opendocs.cookcountyil.gov/analytics/)            | [State of Kansas](https://analytics.kansas.gov/)                                       |
| [City of Seattle](https://www.seattle.gov/about-our-digital-properties/web-analytics) | [Douglas County, NE](http://analytics.douglascounty-ne.gov/)               |
| [Washington State University](https://analytics.wsu.edu/)                 | [State of Indiana](https://analytics.in.gov/)                                          |
| [The States of Jersey](http://webanalytics.gov.je/)                       | [The City of Pittsburgh](http://webstats.pittsburghpa.gov/)                            |
| [U.S. Department of Education](http://www2.ed.gov/analytics)              | [U.S. Department of Veterans Affairs](http://www.oit.va.gov/analytics/)                |
| [USA.gov - General Services Administration](https://www.usa.gov/website-analytics/) | [Government of Canada](https://gcanalyticsapp.com/gca-dashboard/dashboard-index) |
| [State of Georgia](https://analytics.georgia.gov/)                        | [State of Delaware](https://analytics.delaware.gov/)                                  |

[This blog post details their implementations and lessons learned](https://18f.gsa.gov/2016/01/05/tips-for-adapting-analytics-usa-gov/).

## About the components
Ths app uses [Jekyll](https://jekyllrb.com) to build the site, and [Sass](https://sass-lang.com/), [Bourbon](https://bourbon.io), and [Neat](https://neat.bourbon.io) for CSS.

The javascript provided is a [webpacked](https://webpack.js.org/) aggregation of [several different modules](#javascript-modules), leveraging [d3](https://d3js.org/) for the visualizations. [Learn more on the webpack configuration](#webpack-configuration)

This is the main repository for https://analytics.usa.gov.
Additional repositories are:

* https://github.com/18f/analytics-reporter
* https://github.com/18f/analytics-reporter-api

## Developing locally

### Prerequisites

* [Ruby 3.1.4](https://www.ruby-lang.org/en/)
* [NodeJS 20.x.x](https://nodejs.org/en)

Install ruby and node libraries before attempting to run other development
commands:

```bash
# Install dependencies
bundle install
npm install
```

### Run the linters

Linters run on the static files for the repo and ensure that the code is free
from syntax issues and that code style conforms to community best practices.
These checks are also enforced in CI. Run the linters with the following
commands:

```bash
# JavaScript
npm run lint:js
```

```bash
# SCSS
npm run lint:styles
```

### Run the unit tests

Unit tests ensure that code works as expected and can be helpful in finding
bugs. These tests are also enforced to pass via CI. Run the unit tests with the
following command:

```bash
npm test
```

### Build and serve the site on your local machine

```bash
# Install dependencies
bundle install
npm install

# Compile and serve the site locally, watching for changes.
npm start
```

Now the site will be served at http://localhost:4000 and will be reloaded if you
make changes to the source files locally.

### Developing with local data

The development settings assume data is available at `/fakedata`. You can change this in `_development.yml`.

### Developing with real live data from `analytics-reporter`

If also working off of local data, e.g. using `analytics-reporter`, you will need to make the data available over HTTP _and_ through CORS.

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

The data will be available at `http://localhost:3000` over CORS, with no path prefix. For example, device data will be at `http://localhost:3000/devices.json`.

### Adding Additional Agencies

1. Ensure that data is being collected for a specific agency's Google Analytics ID. Visit [18F's analytics-reporter](https://github.com/18F/analytics-reporter) for more information. Save the url path for the data collection path.
1. Create a new json object in the `/_data/agencies.json` file. The `slug` attribute of the object will be the url path. The `name` attribute is the Agency's name.

### Javascript Modules
* **Index** - includes the main dom selection and rendering queue of components, and the entry point for the webpack bundler.
* **lib/barchart** the d3 configuration of the bar charts
* **lib/blocks** an object of the specific components
* **lib/consoleprint** the console messages displayed to users
* **lib/exceptions** agency data to be changed by discrete exception rules
* **lib/formatters** methods to help format the display of visualization scales and values
* **lib/renderblock** d3 manipulator to load and render data for a component block
* **lib/timeseries** the d3 configuration of the timeseries charts
* **lib/transformers** helper methods to manipulate and consolidate raw data into proportional data.

### Deploying the app

Production and staging applications are deployed via CI automatically. Any
commits to the `master` branch will be deployed to production after passing
automated tests in CI. Any commits to the `staging` branch will be deployed to
the staging application. Any commits to the `develop` branch will be deployed to
the development application.

It shouldn't be necessary to deploy manually, but with the Cloud Foundry CLI
installed, follow these steps to deploy.

To deploy to **analytics.usa.gov** after building the site with the details in `_config.yml`:

```bash
make deploy_production
```

To deploy to **analytics-staging.app.cloud.gov** after building the site with the details in `_config.yml` and `_staging.yml`:

```bash
make deploy_staging
```

### Deploying the app using Docker

_NOTE_: 18F does not use Docker in production!

If you are using Docker in production and you want to deploy just the static pages, you can build an nginx container with the static files built in, running the following command:

```bash
make docker-build-production PROD_IMAGE=yourvendor/your-image-name PROD_TAG=production
```

The resulting image will be an nginx server image that you can safely push and deploy to your server.

The image accepts an environment variable to specify the S3 URL that data at `/data/*` is served from:

```
docker run -p 8080:80 -e S3_BUCKET_URL=https://s3-us-gov-west-1.amazonaws.com/your-s3-bucket/data yourvendor/your-image-name:production
```

### Building & Pushing Docker Images

This repo has git tags. The tag for Docker images built for this repo relate to these git tags. In the examples below, `<version` refers to the tag value of the current commit. When building a new version, be sure to increment the git tag appropriately.

When building images there are 2 images to build: `<version>` and `<version>-production`.

To build the images:

```shell
docker build -f ./Dockerfile -t 18fgsa/analytics.usa.gov:<version> .
docker build -f ./Dockerfile.production -t 18fgsa/analytics.usa.gov:<version>-production .
```

To push the images:

```shell
docker push 18fgsa/analytics.usa.gov:<version>
docker push 18fgsa/analytics.usa.gov:<version>-production
```

### Environments

| Environment | Branch | URL |
|-------------| ------ | --- |
| Production | master | https://analytics.usa.gov |
| Staging | staging | https://analytics-staging.app.cloud.gov |
| Development | develop | https://analytics-develop.app.cloud.gov |

### Webpack Configuration

The application compiles es6 modules into web friendly js via Wepback and the [babel loader](https://webpack.js.org/loaders/babel-loader/).

The webpack configuration is set in the [wepback.config.js](./webpack.config.js).

The current configuration uses babel `present-env`.

The webpack also includes linting using [eslint](https://eslint.org/) leveraging the [AirBnb linting preset](https://www.npmjs.com/package/eslint-config-airbnb).

The webconfig uses the [TerserWebpackPlugin](https://webpack.js.org/plugins/terser-webpack-plugin/) to minimize the bundle.

The resulting uglified bundle is build into `assest/bundle.js`.

#### NPM webpack commands

| Command | purpose |
|-------------| ------ |
| npm run build-dev | a watch command rebuilding the webpack with a development configuration (i.e. no minifiecation) |
| npm run build-prod | a webpack command to build a minified and transpiled bundle.js |

### Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
