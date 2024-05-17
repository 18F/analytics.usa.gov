import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import renderBlock from "../../lib/chart_helpers/renderblock";
import { titleExceptions } from "../../lib/exceptions";
import barChart from "../../lib/chart_helpers/barchart";
import formatters from "../../lib/chart_helpers/formatters";

/**
 * Retrieves the realitme top page report from the passed data URL and creates a
 * visualization for the count of users visiting sites for the current agency.
 *
 * @param {String} dataHrefBase the URL of the base location of the data to be
 * downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @param {String} reportFileName the file name of the report to use as a data
 * source for the data visualization.
 */
function TopPagesRealtime({ dataHrefBase, reportFileName }) {
  const dataURL = `${dataHrefBase}/${reportFileName}`;
  const ref = useRef(null);

  useEffect(() => {
    const initRealtimeChart = async () => {
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
        );
      return result;
    };
    initRealtimeChart().catch(console.error);
  }, []);

  return (
    <figure
      className="top-pages__realtime"
      data-source={dataURL}
      data-refresh="15"
      ref={ref}
    >
      <div className="data bar-chart"></div>
    </figure>
  );
}

TopPagesRealtime.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
  reportFileName: PropTypes.string.isRequired,
};

export default TopPagesRealtime;
