import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import renderBlock from "../../lib/chart_helpers/renderblock";

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

  useEffect(() => {
    const initTopSourceMediaChart = async () => {
      const result = await d3
        .select(ref.current)
        .datum({
          source: dataURL,
          block: ref.current,
        })
        .call(renderBlock.buildCompactBarChart("session_source_medium"));
      return result;
    };
    initTopSourceMediaChart().catch(console.error);
  }, []);

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
