import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import renderBlock from "../../js/lib/renderblock";

function BrowsersChart({ dataHrefBase }) {
  const dataURL = `${dataHrefBase}/browsers.json`;
  const ref = useRef(null);

  useEffect(() => {
    const initBrowsersChart = async () => {
      const result = await d3
        .select(ref.current)
        .datum({
          source: dataURL,
          block: ref.current,
        })
        .call(renderBlock.buildCompactBarChart("browser"));
      return result;
    };
    initBrowsersChart().catch(console.error);
  }, []);

  return (
    <figure id="chart_browsers" ref={ref}>
      <div className="data bar-chart"></div>
    </figure>
  );
}

BrowsersChart.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default BrowsersChart;
