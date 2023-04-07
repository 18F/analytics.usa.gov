[![Code Climate](https://codeclimate.com/github/18F/analytics.usa.gov/badges/gpa.svg)](https://codeclimate.com/github/18F/analytics.usa.gov)  [![CircleCI](https://circleci.com/gh/18F/analytics.usa.gov.svg?style=shield)](https://circleci.com/gh/18F/analytics.usa.gov)  [![Dependency Status](https://gemnasium.com/badges/github.com/18F/analytics.usa.gov.svg)](https://gemnasium.com/github.com/18F/analytics.usa.gov)



## analytics.usa.gov

A project to publish website analytics for the US federal government.

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
* https://github.com/18f/analytics-restarter

## Developing locally

There are a couple of different ways to develop locally. Either using docker or running without docker.

### Setup using Docker

You need  [Docker](https://github.com/docker/docker) and  [docker-compose](https://github.com/docker/compose).

To build and run the app with docker-compose, run `docker-compose up -d` then you can access the app from `http://localhost:4000`, as the local filesystem is mounted on top of the docker container you can edit the files as you are developing locally.

* this does not yet run the webpack script.

To see the jekyll logs, run:

```bash
docker-compose logs -f
```

## Running locally without docker.
Run Jekyll with development settings:

```bash
make dev
npm install
npm run build-dev
```

(This runs `bundle exec jekyll serve --watch --config=_config.yml,_development.yml`.)

### Adding Additional Agencies

1. Ensure that data is being collected for a specific agency's Google Analytics ID. Visit [18F's analytics-reporter](https://github.com/18F/analytics-reporter) for more information. Save the url path for the data collection path.
1. Create a new html file in the `_agencies` directory. The name of the file will be the url path.
    ```bash
    touch _agencies/agencyx.html
    ```
1. Create a new html file in the `_data_pages` directory. Use the same name you used in step 2. This will be the data download page for this agency
    ```bash
    touch _data_pages/agencyx.html
    ```
1. Set the required data for for the new files. (Both files need this data.) example:
    ```yaml
    ---
    name: Agency X # Name of the page
    slug: agencyx # Same as the name of the html files. Used to generate data page links.
    layout: default # type of layout used. available layouts are in `_layouts`
    ---
    ```
1. Agency page: Below the data you just entered, include the page content you want. The `_agencies` page will use the `charts.html` partial and the `_data_pages` pages will use the `data_download.html` partial. example:
    ```yaml
    {% include charts.html %}
    ```

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
| Staging | master | https://analytics-staging.app.cloud.gov |

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
