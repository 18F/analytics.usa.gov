import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import renderBlock from "../../lib/chart_helpers/renderblock";
import formatters from "../../lib/chart_helpers/formatters";

/**
 * Retrieves the device report from the passed data URL and creates a
 * visualization for the count of users visiting sites for the current agency.
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @returns {import('react').ReactElement} The rendered element
 */
function Visitors30Days({ dataHrefBase }) {
  // This was using devices 30 days and setting this value as a side effect of
  // creating the devices chart.  users.json is 90 days, so just stick with
  // devices.json for now.
  const reportURL = `${dataHrefBase}/devices.json`;
  const ref = useRef(null);

  useEffect(() => {
    const initVisitors30DaysChart = async () => {
      const result = await d3
        .select(ref.current)
        .datum({
          source: reportURL,
          block: ref.current,
        })
        .call(
          renderBlock.loadAndRender().render((selection, data) => {
            const total = data.totals.visits;
            selection.text(formatters.readableBigNumber(total));
          }),
        );
      return result;
    };
    initVisitors30DaysChart().catch(console.error);
  });

  return (
    <div ref={ref}>
      There were{" "}
      <span id="total_visitors" className="data">
        ...
      </span>{" "}
      sessions in the last 30 days.
    </div>
  );
}

Visitors30Days.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default Visitors30Days;
