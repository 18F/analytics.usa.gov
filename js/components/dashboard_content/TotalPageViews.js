import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

import DataLoader from "../../lib/data_loader";
import formatters from "../../lib/chart_helpers/formatters";

/**
 * Retrieves the page views for 30 days report from the passed data URL and
 * creates a visualization for the total page views for the current agency.
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @returns {import('react').ReactElement} The rendered element
 */
function TotalPageViews({ dataHrefBase }) {
  const dataURL = `${dataHrefBase}/page-views-30-days.json`;
  const ref = useRef(null);
  const [rawData, setRawData] = useState(null);
  const [formattedData, setFormattedData] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!rawData) {
        const data = await DataLoader.loadJSON(dataURL);
        await setRawData(data);
      } else {
        if (rawData.data[0]) {
          setFormattedData(
            formatters.readableBigNumber(rawData.data[0].pageviews),
          );
        }
      }
    };
    init().catch(console.error);
  }, [rawData]);

  return (
    <>
      <div ref={ref}>
        <div className="data chart__rate padding-top-05">
          {formattedData ? formattedData : "..."}
        </div>
      </div>
    </>
  );
}

TotalPageViews.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default TotalPageViews;
