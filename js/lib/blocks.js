import d3 from "d3";

import renderBlock from "./renderblock";
import barChart from "./barchart";
import formatters from "./formatters";

/*
 * Define block renderers for each of the different data types.
 */
export default {
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
