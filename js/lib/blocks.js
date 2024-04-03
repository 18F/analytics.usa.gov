import d3 from "d3";

import renderBlock from "./renderblock";
import { exceptions, titleExceptions } from "./exceptions";
import barChart from "./barchart";
import buildTimeSeries from "./timeseries";
import formatters from "./formatters";
import transformers from "./transformers";
import { isPartOfUnitedStates } from "./territories";

/*
 * Define block renderers for each of the different data types.
 */
export default {
  // The realtime block is just `data.totals.active_visitors` formatted with commas
  realtime: renderBlock.loadAndRender().render((selection, data) => {
    const totals = data.data[0];
    selection.text(formatters.addCommas(+totals.active_visitors));
  }),

  sessions_30_days: renderBlock
    .loadAndRender()
    .transform((data) => data)
    .render((svg, data) => {
      const days = data.data;
      days.forEach((d) => {
        d.visits = +d.visits;
      });

      const y = function (d) {
        return d.visits;
      };

      const series = buildTimeSeries()
        .series([data.data])
        .y(y)
        .label((d) => formatters.formatDate(d.date))
        .title(
          (d) =>
            `${formatters.addCommas(d.visits)} visits during the day of ${d.date}`,
        );

      series.xScale().domain(d3.range(0, days.length + 1));

      series.yScale().domain([0, d3.max(days, y)]);

      series.yAxis().tickFormat(formatters.formatVisits());

      svg.call(series);
    }),

  // The average engagement duration block is the engagement duration divided
  // by the number of sessions. The result is rounded and formatted to a
  // percentage.
  average_engagement_duration_per_session: renderBlock
    .loadAndRender()
    .render((selection, data) => {
      const metrics = data.data[0];
      const avgEngagementDuration =
        parseInt(metrics.userEngagementDuration) / parseInt(metrics.visits);
      selection.text(formatters.secondsToReadableTime(avgEngagementDuration));
    }),

  // The engagement rate is rounded and formatted to a percentage.
  engagement_rate: renderBlock.loadAndRender().render((selection, data) => {
    const metrics = data.data[0];
    const engagementRate = parseFloat(metrics.engagementRate) * 100;
    selection.text(formatters.floatToPercent(engagementRate));
  }),

  // The session sources block is a stack layout
  session_default_channel_group: renderBlock.buildCompactBarChart(
    "session_default_channel_group",
  ),

  // The session mediums block is a stack layout
  session_source_medium: renderBlock.buildCompactBarChart(
    "session_source_medium",
  ),

  // The OS block is a stack layout
  os: renderBlock.buildCompactBarChart("os"),

  // The windows block is a stack layout
  windows: renderBlock.buildCompactBarChart("os_version"),

  // The devices block is a stack layout
  devices: renderBlock
    .loadAndRender()
    .transform((d) => {
      const devices = transformers.listify(d.totals.by_device);
      devices.forEach((device) => {
        if (device.key === "smart tv") {
          device.key = "Smart TV";
        }
      });
      return transformers.findProportionsOfMetricFromValue(devices);
    })
    .render(
      barChart()
        .value((d) => d.proportion)
        .format(formatters.floatToPercent),
    )
    .on("render", (selection, data) => {
      /*
       * XXX this is an optimization. Rather than loading
       * users.json, we total up the device numbers to get the "big
       * number", saving us an extra XHR load.
       */
      const total = d3.sum(data.map((d) => d.value));
      d3.select("#total_visitors").text(formatters.readableBigNumber(total));
    }),

  // The browsers block is a table
  browsers: renderBlock.buildCompactBarChart("browser"),

  // The IE block is a stack, but with some extra work done to transform the
  // data beforehand to match the expected object format
  ie: renderBlock.buildBarBasicChart("ie_version"),

  cities: renderBlock.buildBarChartWithLabel((d) => {
    const cityList = d.data;
    const cityListFiltered = cityList.filter(
      (c) => c.city !== "(not set)" && c.city !== "zz",
    );
    const proportions = transformers.findProportionsOfMetric(
      cityListFiltered,
      (list) => list.map((x) => x.active_visitors),
    );
    return proportions.slice(0, 13);
  }, "city"),

  countries: renderBlock.buildBarChart((d) => {
    let totalVisits = 0;
    let USVisits = 0;
    d.data.forEach((c) => {
      totalVisits += parseInt(c.active_visitors, 10);
      if (isPartOfUnitedStates(c.country)) {
        USVisits += parseInt(c.active_visitors, 10);
      }
    });
    const international = totalVisits - USVisits;
    const data = {
      "United States &amp; Territories": USVisits,
      International: international,
    };
    return transformers.findProportionsOfMetricFromValue(
      transformers.listify(data),
    );
  }),

  us_and_territories: renderBlock.buildBarChartWithLabel((d) => {
    let values = transformers.findProportionsOfMetric(d.data, (list) =>
      list.map((x) => x.active_visitors),
    );
    values = values.filter((c) => isPartOfUnitedStates(c.country));
    return values.slice(0, 3);
  }, "country"),

  international_visits: renderBlock.buildBarChartWithLabel((d) => {
    let values = transformers.findProportionsOfMetric(d.data, (list) =>
      list.map((x) => x.active_visitors),
    );
    values = values.filter((c) => !isPartOfUnitedStates(c.country));
    return values.slice(0, 15);
  }, "country"),

  languages: renderBlock.buildBarChartWithLabel((d) => {
    // 1. filter out non-languages - (other)
    // 2. convert object into array of objects
    // 3. sort desc by visitors #

    const languages = d.totals.by_language;
    const keysToExclude = ["(other)"];
    const filteredLanguages = {};

    for (const key in languages) {
      if (!keysToExclude.includes(key)) {
        filteredLanguages[key] = languages[key];
      }
    }

    const languagesArray = [];
    for (const [key, value] of Object.entries(filteredLanguages)) {
      languagesArray.push({ language: key, visitors: value });
    }

    d.totals.by_language = languagesArray;

    const values = transformers.findProportionsOfMetric(
      d.totals.by_language,
      (list) => list.map((x) => x.visitors),
    );

    return values.slice(0, 10);
  }, "language"),

  "top-downloads": renderBlock
    .loadAndRender()
    .transform((d) => d.data.slice(0, 10))
    .render(
      barChart()
        .value((d) => +d.total_events)
        .label((d) =>
          [
            '<span class="name"><a class="top-download-page" target="_blank" rel="noopener" href=http://',
            d.page,
            ">",
            d.page_title,
            "</a></span> ",
            '<span class="domain" >',
            formatters.formatURL(d.page),
            "</span> ",
            '<span class="divider">/</span> ',
            '<span class="filename"><a class="top-download-file" target="_blank" aria-label="',
            formatters.formatFile(d.file_name),
            '" rel="noopener" href=',
            formatters.formatProtocol(d.page),
            formatters.formatFile(d.file_name),
            ">",
            "download file",
            "</a></span>",
          ].join(""),
        )
        .scale((values) =>
          d3.scale
            .linear()
            .domain([0, 1, d3.max(values)])
            .rangeRound([0, 1, 100]),
        )
        .format(formatters.addCommas),
    ),

  // The top pages first block(s)
  "top-pages-realtime": renderBlock
    .loadAndRender()
    .transform((d) => d.data)
    .on("render", (selection) => {
      selection
        .selectAll(".label")
        .each(function (d) {
          d.text = this.innerText;
        })
        .html("")
        .text((d) => titleExceptions[d.page] || d.page_title);
    })
    .render(
      barChart()
        .label((d) => d.page_title)
        .value((d) => +d.active_visitors)
        .scale((values) =>
          d3.scale
            .linear()
            .domain([0, 1, d3.max(values)])
            .rangeRound([0, 1, 100]),
        )
        .format(formatters.addCommas),
    ),

  // The top pages second and third block(s)
  "top-pages": renderBlock
    .loadAndRender()
    .transform((d) => d.data)
    .on("render", (selection) => {
      // turn the labels into links
      selection
        .selectAll(".label")
        .each(function (d) {
          d.text = this.innerText;
        })
        .html("")
        .append("a")
        .attr("target", "_blank")
        .attr("rel", "noopener")
        .attr("href", (d) => exceptions[d.domain] || `http://${d.domain}`)
        .text((d) => titleExceptions[d.domain] || d.domain);
    })
    .render(
      barChart()
        .label((d) => d.domain)
        .value((d) => +d.visits)
        .scale((values) =>
          d3.scale
            .linear()
            .domain([0, 1, d3.max(values)])
            .rangeRound([0, 1, 100]),
        )
        .format(formatters.addCommas),
    ),
};
