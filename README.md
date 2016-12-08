[![Code Climate](https://codeclimate.com/github/18F/analytics.usa.gov/badges/gpa.svg)](https://codeclimate.com/github/18F/analytics.usa.gov)
[![Build Status](https://travis-ci.org/18F/analytics.usa.gov.png)](https://travis-ci.org/18F/analytics.usa.gov)


## analytics.usa.gov

A project to publish website analytics for the US federal government.

For a detailed description of how the site works, read [18F's blog post on analytics.usa.gov](https://18f.gsa.gov/2015/03/19/how-we-built-analytics-usa-gov/).

Other organizations who have reused this project for their analytics dashboard:
* [The City of Philadelphia, PA](http://analytics.phila.gov/)
* [The City of Boulder, CO](https://bouldercolorado.gov/stats)
* [Tennessee Department of Environment and Conservation](http://analytics.tdec.tn.gov/)
* [The City of Sacramento, CA](http://analytics.cityofsacramento.org/)
* [The City of Anchorage, AK](http://analytics.muni.org/)
* [The City of Santa Monica, CA](http://analytics.smgov.net/)
* [Douglas County, NE](http://analytics.douglascounty-ne.gov/)
* [Washington State University](https://analytics.wsu.edu/)
* [U.S. Department of Education](http://www2.ed.gov/analytics)
* [The States of Jersey](http://webanalytics.gov.je/)
* [The City of Los Angeles](http://webanalytics.lacity.org/)


[This blog post details their implementations and lessons learned](https://18f.gsa.gov/2016/01/05/tips-for-adapting-analytics-usa-gov/).


### Setup

Ths app uses [Jekyll](http://jekyllrb.com) to build the site, and [Sass](http://sass-lang.com/), [Bourbon](http://bourbon.io), and [Neat](http://neat.bourbon.io) for CSS.

Install them all:

```bash
bundle install
```

[`analytics-reporter`](https://github.com/18F/analytics-reporter) is the code that powers the analytics dashboard.
Please clone the `analytics-reporter` next to a local copy of this github repository.

### Adding Additional Agencies
0. Ensure that data is being collected for a specific agency's Google Analytics ID. Visit [18F's analytics-reporter](https://github.com/18F/analytics-reporter) for more information. Save the url path for the data collection path.
0. Create a new html file in the `_agencies` directory. The name of the file will be the url path.

  ```bash
  touch _agencies/agencyx.html
  ```
0. Create a new html file in the `_data_pages` directory. Use the same name you used in step 2. This will be the data download page for this agency

  ```bash
  touch _data_pages/agencyx.html
  ```
0. Set the required data for for the new files. (Both files need this data.) example:

  ```yaml
  ---
  name: Agency X # Name of the page
  data_url: https://analytics.usa.gov/data/agencyx # Data URL from step 1
  slug: agencyx # Same as the name of the html files. Used to generate data page links.
  layout: default # type of layout used. available layouts are in `_layouts`
  ---
  ```
0. Agency page: Below the data you just entered, include the page content you want. The `_agencies` page will use the `charts.html` partial and the `_data_pages` pages will use the `data_download.html` partial. example:

```yaml
{% include charts.html %}
```

### Developing locally

Run Jekyll with development settings:

```bash
make dev
```

(This runs `bundle exec jekyll serve --watch --config=_config.yml,_development.yml`.)

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


### Deploying the app

To deploy to **analytics.usa.gov** after building the site with the details in `_config.yml`:

```bash
make deploy_production
```

To deploy to **analytics-staging.app.cloud.gov** after building the site with the details in `_config.yml` and `_staging.yml`:

```bash
make deploy_staging
```


### Environments

| Environment | Branch | URL |
|-------------| ------ | --- |
| Production | master | https://analytics.usa.gov |
| Staging | master | https://analytics-staging.app.cloud.gov |

### Public domain

This project is in the worldwide [public domain](LICENSE.md). As stated in [CONTRIBUTING](CONTRIBUTING.md):

> This project is in the public domain within the United States, and copyright and related rights in the work worldwide are waived through the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/).
>
> All contributions to this project will be released under the CC0 dedication. By submitting a pull request, you are agreeing to comply with this waiver of copyright interest.
