import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import renderBlock from "../../lib/chart_helpers/renderblock";
import { exceptions, titleExceptions } from "../../lib/exceptions";
import barChart from "../../lib/chart_helpers/barchart";
import formatters from "../../lib/chart_helpers/formatters";

/**
 * Retrieves the top pages report from the passed data URL and report file name
 * creates a visualization for the count of users visiting sites for the current
 * agency.
 *
 * @param {String} dataHrefBase the URL of the base location of the data to be
 * downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @param {String} reportFileName the file name of the report to use as a data
 * source for the data visualization.
 */
function TopPagesHistorical({ dataHrefBase, reportFileName }) {
  const dataURL = `${dataHrefBase}/${reportFileName}`;
  const ref = useRef(null);

  useEffect(() => {
    const initHistoricalChart = async () => {
      const result = await d3
        .select(ref.current)
        .datum({
          source: dataURL,
          block: ref.current,
        })
        .call(
          renderBlock
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
                .attr(
                  "href",
                  (d) => exceptions[d.domain] || `http://${d.domain}`,
                )
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
        );
      return result;
    };
    initHistoricalChart().catch(console.error);
  });

  return (
    <figure className="bar-chart__top-pages" data-source={dataURL} ref={ref}>
      <div className="data bar-chart"></div>
    </figure>
  );
}

TopPagesHistorical.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
  reportFileName: PropTypes.string.isRequired,
};

export default TopPagesHistorical;
