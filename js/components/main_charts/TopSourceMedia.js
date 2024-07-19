import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

import ChartBuilder from "../../lib/chart_helpers/chart_builder";
import DataLoader from "../../lib/data_loader";

/**
 * Retrieves the top source media report from the passed data URL and creates a
 * visualization for the count of users visiting sites with from each type of
 * source media for the current agency.
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @returns {import('react').ReactElement} The rendered element
 */
function TopSourceMedia({ dataHrefBase }) {
  const dataURL = `${dataHrefBase}/top-session-source-medium-30-days.json`;
  const ref = useRef(null);
  const [sourceMediaData, setSourceMediaData] = useState(null);

  useEffect(() => {
    const initSourceMediaChart = async () => {
      if (!sourceMediaData) {
        const data = await DataLoader.loadJSON(dataURL);
        await setSourceMediaData(data);
      } else {
        const chartBuilder = new ChartBuilder();
        await chartBuilder.buildCompactBarChart(
          ref.current,
          sourceMediaData,
          "session_source_medium",
        );
      }
    };
    initSourceMediaChart().catch(console.error);
  }, [sourceMediaData]);

  return (
    <figure id="chart_session_source_medium" ref={ref}>
      <div className="data bar-chart"></div>
    </figure>
  );
}

TopSourceMedia.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default TopSourceMedia;
