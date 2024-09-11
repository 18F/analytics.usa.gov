import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

import ChartBuilder from "../../lib/chart_helpers/chart_builder";
import transformers from "../../lib/chart_helpers/transformers";
import DataLoader from "../../lib/data_loader";

/**
 * Retrieves the data report from the passed data URL and creates a
 * consolidated bar chart visualization for the data in the provided key.
 *
 * @param {object} props the properties for the component.
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @param {number} props.maxItems the max number of items to be displayed in the
 * bar chart after consolidating items beyond the maximum.
 * @returns {import('react').ReactElement} The rendered element
 */
function DownloadFileExtensionChart({ dataHrefBase, maxItems }) {
  const dataURL = `${dataHrefBase}/top-download-file-extensions-30-days.json`;
  const ref = useRef(null);
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const initChart = async () => {
      if (!chartData) {
        const data = await DataLoader.loadJSON(dataURL);
        await setChartData(data);
      } else {
        const method = (d) => {
          if (d.totals.by_file_extension) {
            const formattedTotals = Object.fromEntries(
              Object.entries(d.totals.by_file_extension).map(([key, value]) => [
                key.toUpperCase(),
                value,
              ]),
            );
            d.totals.by_file_extension = formattedTotals;
          }
          return transformers.toTopPercentsWithMaxItems(
            d,
            "file_extension",
            maxItems,
          );
        };
        const chartBuilder = new ChartBuilder();
        await chartBuilder.buildBarChart(ref.current, chartData, method);
      }
    };
    initChart().catch(console.error);
  }, [chartData]);

  return (
    <figure id="chart_file_extension" ref={ref}>
      <div className="data chart__bar-chart"></div>
    </figure>
  );
}

DownloadFileExtensionChart.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
  maxItems: PropTypes.number.isRequired,
};

export default DownloadFileExtensionChart;
