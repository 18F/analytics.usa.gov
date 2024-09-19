import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

import ChartBuilder from "../../lib/chart_helpers/chart_builder";
import DataLoader from "../../lib/data_loader";

/**
 * Retrieves the top session channel group report from the passed data URL and
 * creates a visualization for the count of users visiting sites for the current
 * agency with each channel.
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @returns {import('react').ReactElement} The rendered element
 */
function TopChannels({ dataHrefBase }) {
  const dataURL = `${dataHrefBase}/top-session-channel-group-30-days.json`;
  const ref = useRef(null);
  const [channelData, setChannelData] = useState(null);

  useEffect(() => {
    const initChannelsChart = async () => {
      if (!channelData) {
        const data = await DataLoader.loadJSON(dataURL);
        await setChannelData(data);
      } else {
        const chartBuilder = new ChartBuilder();
        await chartBuilder.buildCompactBarChart(
          ref.current,
          channelData,
          "session_default_channel_group",
        );
      }
    };
    initChannelsChart().catch(console.error);
  }, [channelData]);

  return (
    <>
      <div className="chart__title">
        <a href="/definitions#dimension_default_channel_group">Top Channels</a>
      </div>
      <figure id="chart_session_channel_group" ref={ref}>
        <div className="data chart__bar-chart"></div>
      </figure>
    </>
  );
}

TopChannels.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default TopChannels;
