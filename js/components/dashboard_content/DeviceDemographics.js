import React from "react";
import PropTypes from "prop-types";

import DevicesChart from "./DevicesChart";
import BrowsersChart from "./BrowsersChart";
import OperatingSystemsChart from "./OperatingSystemsChart";

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
    <>
      <section id="devices" className="desktop:grid-col-4 bar-chart-component">
        <h4>
          <a href="/definitions#dimension_device_category">Devices</a>
        </h4>
        <DevicesChart dataHrefBase={dataHrefBase} />
      </section>

      <section id="browsers" className="desktop:grid-col-4 bar-chart-component">
        <h4>
          <a href="/definitions#dimension_browser">Web Browsers</a>
        </h4>
        <BrowsersChart dataHrefBase={dataHrefBase} />
      </section>

      <section
        id="operating_systems"
        className="desktop:grid-col-4 bar-chart-component"
      >
        <h4>
          <a href="/definitions#dimension_operating_system">
            Operating Systems
          </a>
        </h4>
        <OperatingSystemsChart dataHrefBase={dataHrefBase} />
      </section>
    </>
  );
}

DeviceDemographics.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default DeviceDemographics;
