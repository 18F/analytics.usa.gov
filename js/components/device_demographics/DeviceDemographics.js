import React from "react";
import PropTypes from "prop-types";

import DevicesChart from "./DevicesChart";
import BrowsersChart from "./BrowsersChart";
import OperatingSystemsChart from "./OperatingSystemsChart";

function DeviceDemographics({ dataURL, dataPrefix }) {
  const dataHrefBase = `${dataURL}/${dataPrefix}`;

  return (
    <>
      <section id="devices" className="desktop:grid-col-4 bar-chart-component">
        <h4>Devices</h4>
        <DevicesChart dataHrefBase={dataHrefBase} />
      </section>

      <section id="browsers" className="desktop:grid-col-4 bar-chart-component">
        <h4>Web Browsers</h4>
        <BrowsersChart dataHrefBase={dataHrefBase} />
      </section>

      <section
        id="operating_systems"
        className="desktop:grid-col-4 bar-chart-component"
      >
        <h4>Operating Systems</h4>
        <OperatingSystemsChart dataHrefBase={dataHrefBase} />
      </section>
    </>
  );
}

DeviceDemographics.propTypes = {
  dataURL: PropTypes.string.isRequired,
  dataPrefix: PropTypes.string.isRequired,
};

export default DeviceDemographics;
