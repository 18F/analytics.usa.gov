import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

import DataLoader from "../../lib/data_loader";
import formatters from "../../lib/chart_helpers/formatters";

/**
 * Retrieves the users with file downloads report from the passed data URL and
 * creates a visualization for the total users downloading files for the current
 * agency.
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @returns {import('react').ReactElement} The rendered element
 */
function UsersWithFileDownloads({ dataHrefBase }) {
  const dataURL = `${dataHrefBase}/users-with-file-downloads-30-days.json`;
  const ref = useRef(null);
  const [rawData, setRawData] = useState(null);
  const [formattedData, setFormattedData] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!rawData) {
        const data = await DataLoader.loadJSON(dataURL);
        await setRawData(data);
      } else {
        setFormattedData(formatters.readableBigNumber(rawData.totals.users));
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

UsersWithFileDownloads.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default UsersWithFileDownloads;
