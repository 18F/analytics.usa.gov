import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

import DataLoader from "../../lib/data_loader";
import ChartBuilder from "../../lib/chart_helpers/chart_builder";

/**
 * Retrieves the browser report from the passed data URL and creates a
 * visualization for the breakdown of browsers of users visiting sites for the
 * current agency.
 *
 * @param {object} props the properties for the component
 * @param {*} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @returns {import('react').ReactElement} The rendered element
 */
function BrowsersChart({ dataHrefBase }) {
  const dataURL = `${dataHrefBase}/browsers.json`;
  const ref = useRef(null);
  const [browserData, setBrowserData] = useState(null);

  useEffect(() => {
    const initBrowsersChart = async () => {
      if (!browserData) {
        const data = await DataLoader.loadJSON(dataURL);
        await setBrowserData(data);
      } else {
        const chartBuilder = new ChartBuilder();
        await chartBuilder.buildCompactBarChart(
          ref.current,
          browserData,
          "browser",
        );
      }
    };
    initBrowsersChart().catch(console.error);
  }, [browserData]);

  return (
    <>
      <div className="chart__title">
        <a href="/definitions#dimension_browser">Web Browsers</a>
      </div>
      <figure id="chart_browsers" ref={ref}>
        <div className="data chart__bar-chart"></div>
      </figure>
    </>
  );
}

BrowsersChart.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default BrowsersChart;
