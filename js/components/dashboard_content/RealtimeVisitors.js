import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

import ChartBuilder from "../../lib/chart_helpers/chart_builder";
import DataLoader from "../../lib/data_loader";
import formatters from "../../lib/chart_helpers/formatters";

/**
 * Retrieves the realtime users report from the passed data URL and creates a
 * visualization for the count of users visiting sites for the current agency.
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @param {string} props.agency the display name for the current agency.
 * @param {number} props.refreshSeconds the number of seconds to wait before
 * refreshing chart data.
 * @returns {import('react').ReactElement} The rendered element
 */
function RealtimeVisitors({ dataHrefBase, agency, refreshSeconds }) {
  const dataURL = `${dataHrefBase}/realtime.json`;
  const ref = useRef(null);
  const [realtimeVisitorData, setRealtimeVisitorData] = useState(null);

  useEffect(() => {
    const initRealtimeVisitorsChart = async () => {
      if (!realtimeVisitorData) {
        const data = await DataLoader.loadJSON(dataURL);
        await setRealtimeVisitorData(data);
        // Refresh data every interval. useEffect will run and update the chart
        // when the state is changed.
        setInterval(() => {
          DataLoader.loadJSON(dataURL).then((data) => {
            setRealtimeVisitorData(data);
          });
        }, refreshSeconds * 1000);
      } else {
        const chartBuilder = new ChartBuilder();
        await chartBuilder
          .setElement(ref.current)
          .setData(realtimeVisitorData)
          .setRenderer((selection, data) => {
            const totals = data.data[0];
            selection.text(
              totals ? formatters.addCommas(+totals.active_visitors) : 0,
            );
          })
          .build();
      }
    };
    initRealtimeVisitorsChart().catch(console.error);
  }, [realtimeVisitorData]);

  return (
    <section className="chart-realtime__visitors-count" ref={ref}>
      <div className="grid-row">
        <h2 className="chart-realtime__current-visitors data grid-col-12">
          ...
        </h2>
      </div>
      <div className="grid-row">
        <div className="chart-realtime__description desktop:grid-col-8 desktop:grid-offset-2">
          users on {agency} websites and apps in the last 30 minutes
        </div>
      </div>
    </section>
  );
}

RealtimeVisitors.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
  agency: PropTypes.string.isRequired,
  refreshSeconds: PropTypes.number.isRequired,
};

export default RealtimeVisitors;
