import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

import ChartBuilder from "../../lib/chart_helpers/chart_builder";
import DataLoader from "../../lib/data_loader";
import formatters from "../../lib/chart_helpers/formatters";

/**
 * Retrieves the engagement rate report from the passed data URL and creates a
 * visualization for the engagement of users visiting sites for the current
 * agency.
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @returns {import('react').ReactElement} The rendered element
 */
function EngagementRate({ dataHrefBase }) {
  const dataURL = `${dataHrefBase}/engagement-rate-30-days.json`;
  const ref = useRef(null);
  const [engagementRateData, setEngagementRateData] = useState(null);

  useEffect(() => {
    const initEngagementRateChart = async () => {
      if (!engagementRateData) {
        const data = await DataLoader.loadJSON(dataURL);
        await setEngagementRateData(data);
      } else {
        const chartBuilder = new ChartBuilder();
        await chartBuilder
          .setElement(ref.current)
          .setData(engagementRateData)
          .setRenderer((selection, data) => {
            const metrics = data.data[0] || {};
            const engagementRate = parseFloat(metrics.engagementRate) * 100;
            selection.text(formatters.floatToPercent(engagementRate));
          })
          .build();
      }
    };
    initEngagementRateChart().catch(console.error);
  }, [engagementRateData]);

  return (
    <>
      <div ref={ref}>
        <div className="data"></div>
      </div>
    </>
  );
}

EngagementRate.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default EngagementRate;
