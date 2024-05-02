import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import renderBlock from "../../lib/chart_helpers/renderblock";
import formatters from "../../lib/chart_helpers/formatters";

function RealtimeVisitors({ dataURL, dataPrefix, agency }) {
  const reportURL = `${dataURL}/${dataPrefix}/realtime.json`;
  const description = agency ? agency : "U.S. Federal Government";
  const ref = useRef(null);

  useEffect(() => {
    const initRealtimeVisitorsChart = async () => {
      const result = await d3
        .select(ref.current)
        .datum({
          source: reportURL,
          block: ref.current,
        })
        .call(
          renderBlock.loadAndRender().render((selection, data) => {
            const totals = data.data[0];
            selection.text(formatters.addCommas(+totals.active_visitors));
          }),
        );
      return result;
    };
    initRealtimeVisitorsChart().catch(console.error);
  });

  return (
    <section
      className="chart-realtime__visitors-count"
      data-refresh="15"
      ref={ref}
    >
      <div className="grid-row">
        <h2 className="chart-realtime__current-visitors data grid-col-12">
          ...
        </h2>
      </div>
      <div className="grid-row">
        <div className="chart-realtime__description desktop:grid-col-8 desktop:grid-offset-2">
          people on {description} websites and apps in the last 30 minutes
        </div>
      </div>
    </section>
  );
}

RealtimeVisitors.propTypes = {
  dataURL: PropTypes.string.isRequired,
  dataPrefix: PropTypes.string.isRequired,
  agency: PropTypes.string,
};

export default RealtimeVisitors;
