import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

import ChartBuilder from "../../lib/chart_helpers/chart_builder";

/**
 * Creates a consolidated bar chart visualization for the provided data and key.
 *
 * @param {object} props the properties for the component.
 * @param {object} props.data the data to be displayed in the chart.
 * @param {string} props.chartDataKey the key of the data object to use for the chart
 * proportions.
 * @param {number} props.maxItems the max number of items to be displayed in the
 * bar chart after consolidating items beyond the maximum.
 * @returns {import('react').ReactElement} The rendered element
 */
function ConsolidatedBarChart({ data, chartDataKey, maxItems }) {
  const ref = useRef(null);

  useEffect(() => {
    const initChart = async () => {
      const chartBuilder = new ChartBuilder();
      await chartBuilder.buildConsolidatedBarchart(
        ref.current,
        data,
        chartDataKey,
        maxItems,
      );
    };
    initChart().catch(console.error);
  }, [data]);

  return (
    <figure id={`chart_${chartDataKey}`} ref={ref}>
      <div className="data chart__bar-chart margin-top-2"></div>
    </figure>
  );
}

ConsolidatedBarChart.propTypes = {
  data: PropTypes.object.isRequired,
  chartDataKey: PropTypes.string.isRequired,
  maxItems: PropTypes.number.isRequired,
};

export default ConsolidatedBarChart;
