import React from "react";
import PropTypes from "prop-types";

import TopChannels from "./TopChannels";
import TopSourceMedia from "./TopSourceMedia";

/**
 * Contains charts and other data visualizations for the traffic sources
 * section of the site. This component is mainly laying out the structure for
 * the section and passes props necessary for getting data and displaying
 * visualizations to child components.
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @returns {import('react').ReactElement} The rendered element
 */
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
