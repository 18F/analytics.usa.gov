import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import barChart from "../../lib/chart_helpers/barchart";
import formatters from "../../lib/chart_helpers/formatters";
import renderBlock from "../../lib/chart_helpers/renderblock";

function TopDownloads({ dataURL, dataPrefix }) {
  const reportURL = `${dataURL}/${dataPrefix}/top-downloads-yesterday.json`;
  const ref = useRef(null);

  useEffect(() => {
    const initTopDownloads = async () => {
      const result = await d3
        .select(ref.current)
        .datum({
          source: reportURL,
          block: ref.current,
        })
        .call(
          renderBlock
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
        );
      return result;
    };
    initTopDownloads().catch(console.error);
  }, []);

  return (
    <figure id="top-downloads" ref={ref}>
      <div className="data bar-chart"></div>
    </figure>
  );
}

TopDownloads.propTypes = {
  dataURL: PropTypes.string.isRequired,
  dataPrefix: PropTypes.string.isRequired,
};

export default TopDownloads;
