import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import renderBlock from "../../lib/chart_helpers/renderblock";
import nestCharts from "../../lib/chart_helpers/nest_charts";

function OperatingSystemsChart({ dataHrefBase }) {
  const osDataURL = `${dataHrefBase}/os.json`;
  const windowsDataURL = `${dataHrefBase}/windows.json`;
  const osRef = useRef(null);
  const windowsRef = useRef(null);

  useEffect(() => {
    const initOperatingSystemsChart = async () => {
      await d3
        .select(osRef.current)
        .datum({
          source: osDataURL,
          block: osRef.current,
        })
        .call(renderBlock.buildCompactBarChart("os"));

      await d3
        .select(windowsRef.current)
        .datum({
          source: windowsDataURL,
          block: windowsRef.current,
        })
        .call(renderBlock.buildCompactBarChart("os_version"));

      // Sleep for half a second because the above charts are still not loaded
      // for some reason.  TODO: figure out why
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(500);

      // nest the windows chart inside the OS chart once they're both rendered
      // TODO: Remove windows versions?
      await d3
        .select(osRef.current)
        .call(nestCharts, "Windows", d3.select(windowsRef.current));

      return;
    };
    initOperatingSystemsChart().catch(console.error);
  }, []);

  return (
    <>
      <figure id="chart_os" ref={osRef}>
        <div className="data bar-chart"></div>
      </figure>
      <figure
        id="chart_windows"
        className="hide"
        data-scale-to-parent="true"
        ref={windowsRef}
      >
        <h4>Windows</h4>
        <div className="data bar-chart"></div>
      </figure>
    </>
  );
}

OperatingSystemsChart.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default OperatingSystemsChart;
