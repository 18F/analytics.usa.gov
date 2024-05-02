import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import renderBlock from "../../js/lib/renderblock";

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
