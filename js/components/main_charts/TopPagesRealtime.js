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
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @param {string} props.reportFileName the file name of the report to use as a
 * data source for the data visualization.
 * @param {number} props.numberOfListingsToDisplay the count of top page
 * listings to display in the bar chart.
 * @returns {import('react').ReactElement} The rendered element
 */
function TopPagesRealtime({
  dataHrefBase,
  reportFileName,
  numberOfListingsToDisplay,
}) {
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
            .transform((d) => d.data.slice(0, numberOfListingsToDisplay))
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
      className="top-pages__realtime-bar-chart"
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
  numberOfListingsToDisplay: PropTypes.number.isRequired,
};

export default TopPagesRealtime;
