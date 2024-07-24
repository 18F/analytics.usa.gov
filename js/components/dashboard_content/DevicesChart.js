import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

import ChartBuilder from "../../lib/chart_helpers/chart_builder";
import DataLoader from "../../lib/data_loader";
import barChart from "../../lib/chart_helpers/barchart";
import formatters from "../../lib/chart_helpers/formatters";
import transformers from "../../lib/chart_helpers/transformers";

/**
 * Retrieves the devices report from the passed data URL and creates a
 * visualization for the breakdown of devices of users visiting sites for the
 * current agency.
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @returns {import('react').ReactElement} The rendered element
 */
function DevicesChart({ dataHrefBase }) {
  const dataURL = `${dataHrefBase}/devices.json`;
  const ref = useRef(null);
  const [deviceData, setDeviceData] = useState(null);

  useEffect(() => {
    const initDevicesChart = async () => {
      if (!deviceData) {
        const data = await DataLoader.loadJSON(dataURL);
        await setDeviceData(data);
      } else {
        const chartBuilder = new ChartBuilder();
        await chartBuilder
          .setElement(ref.current)
          .setData(deviceData)
          .setTransformer((d) => {
            const devices = transformers.listify(d.totals.by_device);
            devices.forEach((device) => {
              if (device.key === "smart tv") {
                device.key = "Smart TV";
              }
            });
            return transformers.findProportionsOfMetricFromValue(devices);
          })
          .setRenderer(
            barChart()
              .value((d) => d.proportion)
              .format(formatters.floatToPercent),
          )
          .build();
      }
    };
    initDevicesChart().catch(console.error);
  }, [deviceData]);

  return (
    <figure id="chart_device_types" ref={ref}>
      <div className="data bar-chart"></div>
    </figure>
  );
}

DevicesChart.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default DevicesChart;
