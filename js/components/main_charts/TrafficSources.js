import React from "react";
import PropTypes from "prop-types";

import TopChannels from "./TopChannels";
import TopSourceMedia from "./TopSourceMedia";

function TrafficSources({ dataHrefBase }) {
  return (
    <>
      <section
        id="session_channel_groups"
        className="desktop:grid-col-6 bar-chart-component"
      >
        <h4>Top Channels</h4>
        <TopChannels dataHrefBase={dataHrefBase} />
      </section>

      <section
        id="session_source_mediums"
        className="desktop:grid-col-6 bar-chart-component"
      >
        <h4>Top Sources/Media</h4>
        <TopSourceMedia dataHrefBase={dataHrefBase} />
      </section>
    </>
  );
}

TrafficSources.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default TrafficSources;
