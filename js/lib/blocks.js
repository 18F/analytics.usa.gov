import d3 from 'd3';

import renderBlock from './renderblock';
import { exceptions, titleExceptions } from './exceptions';
import barChart from './barchart';
import buildTimeSeries from './timeseries';
import formatters from './formatters';
import transformers from './transformers';

/*
   * Define block renderers for each of the different data types.
   */
const DISPLAY_THRESHOLD = 1;
export default {

  // the realtime block is just `data.totals.active_visitors` formatted with commas
  realtime: renderBlock()
    .render((selection, data) => {
      const totals = data.data[0];
      selection.text(formatters.formatCommas(+totals.active_visitors));
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
        .label(d => formatters.formatHour(d.hour))
        .title(d => `${formatters.formatCommas(d.visits)
        } visits during the hour of ${
          formatters.formatHour(d.hour)}m`);

      series.xScale()
        .domain(d3.range(0, days.length + 1));

      series.yScale()
        .domain([0, d3.max(days, y)]);

      series.yAxis()
        .tickFormat(formatters.formatVisits());

      svg.call(series);
    }),

  // the OS block is a stack layout
  os: renderBlock()
    .transform(d => transformers.tranformToTopPercents(d, 'os'))
    .render(barChart()
      .value(d => d.proportion)
      .format(formatters.formatPercent)),

  // the windows block is a stack layout
  windows: renderBlock()
    .transform((d) => {
      console.warn(d);
      return transformers.tranformToTopPercents(d, 'os_version');
    })
    .render(barChart()
      .value((d) => {
        console.warn(d);
        console.warn(d.proportion);
        return d.proportion;
      })
      .format(formatters.formatPercent)),

  // the devices block is a stack layout
  devices: renderBlock()
    .transform((d) => {
      const devices = transformers.listify(d.totals.devices);
      return transformers.findProportionsOfMetricFromValue(devices);
    })
    .render(barChart()
      .value(d => d.proportion)
      .format(formatters.formatPercent))
    .on('render', (selection, data) => {
      /*
         * XXX this is an optimization. Rather than loading
         * users.json, we total up the device numbers to get the "big
         * number", saving us an extra XHR load.
         */
      const total = d3.sum(data.map(d => d.value));
      d3.select('#total_visitors')
        .text(formatters.formatBigNumber(total));
    }),

  // the browsers block is a table
  browsers: renderBlock()
    .transform(d => transformers.tranformToTopPercents(d, 'browser'))
    .render(barChart()
      .value(d => d.proportion)
      .format(formatters.formatPercent)),

  // the IE block is a stack, but with some extra work done to transform the
  // data beforehand to match the expected object format
  ie: renderBlock()
    .transform(d => transformers.tranformToTopPercents(d, 'ie_version'))
    .render(
      barChart()
        .value(d => d.proportion)
        .format(formatters.formatPercent),
    ),

  cities: renderBlock()
    .transform((d) => {
      // remove "(not set) from the data"
      const cityList = d.data;
      const cityListFiltered = cityList.filter(c => (c.city !== '(not set)') && (c.city !== 'zz'));
      const proportions = transformers.findProportionsOfMetric(
        cityListFiltered,
        list => list.map(x => x.active_visitors),
      );
      return proportions.slice(0, 10);
    })
    .render(
      barChart()
        .value(d => d.proportion)
        .label(d => d.city)
        .format(formatters.formatPercent),
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
      return formatters.findProportionsOfMetricFromValue(formatters.listify(data));
    })
    .render(
      barChart()
        .value(d => d.proportion)
        .format(formatters.formatPercent),
    ),
  international_visits: renderBlock()
    .transform((d) => {
      let values = formatters.findProportionsOfMetric(
        d.data,
        list => list.map(x => x.active_visitors),
      );
      console.warn('int visits:');
      console.warn(values.slice(0, 15));
      values = values.filter(c => c.country !== 'United States');
      return values.slice(0, 15);
    })
    .render(
      barChart()
        .value(d => d.proportion)
        .format(formatters.formatPercent)
        .label(d => d.country),
    ),

  'top-downloads': renderBlock()
    .transform(d => d.data.slice(0, 10))
    .render(
      barChart()
        .value(d => +d.total_events)
        .label(d => [
          '<span class="name"><a class="top-download-page" target="_blank" href=http://', d.page, '>', d.page_title, '</a></span> ',
          '<span class="domain" >', formatters.formatURL(d.page), '</span> ',
          '<span class="divider">/</span> ',
          '<span class="filename"><a class="top-download-file" target="_blank" href=', d.event_label, '>',
          formatters.formatFile(d.event_label), '</a></span>',
        ].join(''))
        .scale(values => d3.scale.linear()
          .domain([0, 1, d3.max(values)])
          .rangeRound([0, 1, 100]))
        .format(formatters.formatCommas),
    ),

  // the top pages block(s)
  'top-pages': renderBlock()
    .transform(d => d.data)
    .on('render', (selection) => {
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
      .format(formatters.formatCommas)),

  // the top pages block(s)
  'top-pages-realtime': renderBlock()
    .transform(d => d.data)
    .on('render', (selection) => {
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
      .format(formatters.formatCommas)),

};
