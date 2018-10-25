import renderBlock from './renderblock';
import { exceptions, titleExceptions } from './exceptions';
import barChart from './barchart';
import buildTimeSeries from './timeseries';
import helpers from './helpers';

/*
   * Define block renderers for each of the different data types.
   */
export default {

  // the realtime block is just `data.totals.active_visitors` formatted with commas
  realtime: renderBlock()
    .render((selection, data) => {
      const totals = data.data[0];
      selection.text(helpers.formatCommas(+totals.active_visitors));
    }),

  today: renderBlock()
    .transform(data => data)
    .render((svg, data) => {
      const days = data.data;
      days.forEach((d) => {
        d.visits = +d.visits;
      });

      const y = function (d) { return d.visits; };


      const series = buildTimeSeries()
        .series([data.data])
        .y(y)
        .label(d => helpers.formatHour(d.hour))
        .title(d => `${helpers.formatCommas(d.visits)
        } visits during the hour of ${
          helpers.formatHour(d.hour)}m`);

      series.xScale()
        .domain(d3.range(0, days.length + 1));

      series.yScale()
        .domain([0, d3.max(days, y)]);

      series.yAxis()
        .tickFormat(helpers.formatVisits);

      svg.call(series);
    }),

  // the OS block is a stack layout
  os: renderBlock()
    .transform((d) => {
      const values = helpers.listify(d.totals.os);


      const total = d3.sum(values.map(() => d.value));
      return helpers.addShares(helpers.collapseOther(values, total * 0.01));
    })
    .render(barChart()
      .value(d => d.share * 100)
      .format(helpers.formatPercent)),

  // the windows block is a stack layout
  windows: renderBlock()
    .transform((d) => {
      const values = helpers.listify(d.totals.os_version);


      const total = d3.sum(values.map(() => d.value));
      return helpers.addShares(helpers.collapseOther(values, total * 0.001)); // % of Windows
    })
    .render(barChart()
      .value(d => d.share * 100)
      .format(helpers.formatPercent)),

  // the devices block is a stack layout
  devices: renderBlock()
    .transform((d) => {
      const devices = helpers.listify(d.totals.devices);
      return helpers.addShares(devices);
    })
    .render(barChart()
      .value(d => d.share * 100)
      .format(helpers.formatPercent))
    .on('render', (selection, data) => {
      /*
         * XXX this is an optimization. Rather than loading
         * users.json, we total up the device numbers to get the "big
         * number", saving us an extra XHR load.
         */
      const total = d3.sum(data.map(d => d.value));
      d3.select('#total_visitors')
        .text(helpers.formatBigNumber(total));
    }),

  // the browsers block is a table
  browsers: renderBlock()
    .transform((d) => {
      const values = helpers.listify(d.totals.browser);


      const total = d3.sum(values.map(() => d.value));
      return helpers.addShares(helpers.collapseOther(values, total * 0.01));
    })
    .render(barChart()
      .value(d => d.share * 100)
      .format(helpers.formatPercent)),

  // the IE block is a stack, but with some extra work done to transform the
  // data beforehand to match the expected object format
  ie: renderBlock()
    .transform((d) => {
      const values = helpers.listify(d.totals.ie_version);


      const total = d3.sum(values.map(() => d.value));
      return helpers.addShares(helpers.collapseOther(values, total * 0.0001)); // % of IE
    })
    .render(
      barChart()
        .value(d => d.share * 100)
        .format(helpers.formatPercent),
    ),

  cities: renderBlock()
    .transform((d) => {
      // remove "(not set) from the data"
      const cityList = d.data;
      let cityListFiltered = cityList.filter(c => (c.city !== '(not set)') && (c.city !== 'zz'));
      cityListFiltered = helpers.addShares(cityListFiltered, () => d.active_visitors);
      return cityListFiltered.slice(0, 10);
    })
    .render(
      barChart()
        .value(d => d.share * 100)
        .label(d => d.city)
        .format(helpers.formatPercent),
    ),

  countries: renderBlock()
    .transform((d) => {
      let totalVisits = 0;
      let USVisits = 0;
      d.data.forEach((c) => {
        totalVisits += parseInt(c.active_visitors, 10);
        if (c.country === 'United States') {
          USVisits = c.active_visitors;
        }
      });
      const international = totalVisits - USVisits;
      const data = {
        'United States': USVisits,
        'International &amp; Territories': international,
      };
      return helpers.addShares(helpers.listify(data));
    })
    .render(
      barChart()
        .value(d => d.share * 100)
        .format(helpers.formatPercent),
    ),
  international_visits: renderBlock()
    .transform((d) => {
      let countries = helpers.addShares(d.data, () => d.active_visitors);
      countries = countries.filter(c => c.country !== 'United States');
      return countries.slice(0, 15);
    })
    .render(
      barChart()
        .value(d => d.share * 100)
        .label(d => d.country)
        .format(helpers.formatPercent),
    ),

  'top-downloads': renderBlock()
    .transform(d => d.data.slice(0, 10))
    .render(
      barChart()
        .value(d => +d.total_events)
        .label(d => [
          '<span class="name"><a class="top-download-page" target="_blank" href=http://', d.page, '>', d.page_title, '</a></span> ',
          '<span class="domain" >', helpers.formatURL(d.page), '</span> ',
          '<span class="divider">/</span> ',
          '<span class="filename"><a class="top-download-file" target="_blank" href=', d.event_label, '>',
          helpers.formatFile(d.event_label), '</a></span>',
        ].join(''))
        .scale(values => d3.scale.linear()
          .domain([0, 1, d3.max(values)])
          .rangeRound([0, 1, 100]))
        .format(helpers.formatCommas),
    ),

  // the top pages block(s)
  'top-pages': renderBlock()
    .transform(d => d.data)
    .on('render', (selection, data) => {
      // turn the labels into links
      selection.selectAll('.label')
        .each(function (d) {
          d.text = this.innerText;
        })
        .html('')
        .append('a')
        .attr('target', '_blank')
        .attr('href', d => exceptions[d.domain] || (`http://${d.domain}`))
        .text(d => titleExceptions[d.domain] || d.domain);
    })
    .render(barChart()
      .label(d => d.domain)
      .value(d => +d.visits)
      .scale(values => d3.scale.linear()
        .domain([0, 1, d3.max(values)])
        .rangeRound([0, 1, 100]))
      .format(helpers.formatCommas)),

  // the top pages block(s)
  'top-pages-realtime': renderBlock()
    .transform(d => d.data)
    .on('render', (selection, data) => {
      // turn the labels into links
      selection.selectAll('.label')
        .each(function (d) {
          d.text = this.innerText;
        })
        .html('')
        .append('a')
        .attr('target', '_blank')
        .attr('title', d => d.page_title)
        .attr('href', d => exceptions[d.page] || (`http://${d.page}`))
        .text(d => titleExceptions[d.page] || d.page_title);
    })
    .render(barChart()
      .label(d => d.page_title)
      .value(d => +d.active_visitors)
      .scale(values => d3.scale.linear()
        .domain([0, 1, d3.max(values)])
        .rangeRound([0, 1, 100]))
      .format(helpers.formatCommas)),

};
