import d3 from "d3";

import renderBlock from "./renderblock";
import barChart from "./barchart";
import formatters from "./formatters";
import transformers from "./transformers";

/*
 * Define block renderers for each of the different data types.
 */
export default {
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
    ),

  // The browsers block is a table
  browsers: renderBlock.buildCompactBarChart("browser"),

  // The IE block is a stack, but with some extra work done to transform the
  // data beforehand to match the expected object format
  ie: renderBlock.buildBarBasicChart("ie_version"),

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
};
