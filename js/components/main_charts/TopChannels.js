import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import renderBlock from "../../lib/chart_helpers/renderblock";

/**
 * Retrieves the top session channel group report from the passed data URL and
 * creates a visualization for the count of users visiting sites for the current
 * agency with each channel.
 *
 * @param {String} dataHrefBase the URL of the base location of the data to be
 * downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 */
function TopChannels({ dataHrefBase }) {
  const dataURL = `${dataHrefBase}/top-session-channel-group-30-days.json`;
  const ref = useRef(null);

  useEffect(() => {
    const initTopChannelsChart = async () => {
      const result = await d3
        .select(ref.current)
        .datum({
          source: dataURL,
          block: ref.current,
        })
        .call(
          renderBlock.buildCompactBarChart("session_default_channel_group"),
        );
      return result;
    };
    initTopChannelsChart().catch(console.error);
  }, []);

  return (
    <figure id="chart_session_channel_group" ref={ref}>
      <div className="data bar-chart"></div>
    </figure>
  );
}

TopChannels.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default TopChannels;
