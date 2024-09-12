import React from "react";
import PropTypes from "prop-types";

import DevicesChart from "./DevicesChart";
import BrowsersChart from "./BrowsersChart";
import OperatingSystemsChart from "./OperatingSystemsChart";
import ConsolidatedBarChart from "../chart/ConsolidatedBarChart";

/**
 * Contains charts and other data visualizations for the user demographics
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
function DeviceDemographics({ dataHrefBase }) {
  return (
    <div className="padding-top-4 grid-row">
      <div id="devices" className="desktop:grid-col-4 desktop:padding-right-2">
        <DevicesChart dataHrefBase={dataHrefBase} />
        <div className="chart__title desktop:padding-top-2">
          <a href="/definitions#dimension_screen_resolution">
            Top Screen Resolutions
          </a>
        </div>
        <ConsolidatedBarChart
          dataUrl={`${dataHrefBase}/screen-resolution-30-days.json`}
          chartDataKey={"screen_resolution"}
          maxItems={10}
        />
      </div>

      <div id="browsers" className="desktop:grid-col-4 desktop:padding-x-2">
        <BrowsersChart dataHrefBase={dataHrefBase} />
      </div>

      <div
        id="operating_systems"
        className="desktop:grid-col-4 desktop:padding-left-2"
      >
        <OperatingSystemsChart dataHrefBase={dataHrefBase} />
      </div>
    </div>
  );
}

DeviceDemographics.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default DeviceDemographics;
