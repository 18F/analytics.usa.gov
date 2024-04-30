import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import renderBlock from "../../js/lib/renderblock";
import { exceptions, titleExceptions } from "../../js/lib/exceptions";
import barChart from "../../js/lib/barchart";
import formatters from "../../js/lib/formatters";

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
