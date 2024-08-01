import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

import DataLoader from "../../lib/data_loader";
import renderPieChart from "../../lib/chart_helpers/pie_chart";
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
function DevicesPieChart({ dataHrefBase }) {
  const dataURL = `${dataHrefBase}/devices.json`;
  const ref = useRef(null);
  const [deviceData, setDeviceData] = useState(null);
  const [pieSvgWidth, setPieSvgWidth] = useState(null);

  useEffect(() => {
    const initDevicesChart = async () => {
      if (!pieSvgWidth) {
        const resizeObserver = new ResizeObserver((entries) => {
          console.log(entries[0].target.getBoundingClientRect().width);
          const element = entries[0].target;
          setPieSvgWidth(element.getBoundingClientRect().width);
        });
        resizeObserver.observe(ref.current);
      }
      if (!deviceData) {
        const data = await DataLoader.loadJSON(dataURL);
        await setDeviceData(data);
      } else {
        const devices = transformers.listify(deviceData.totals.by_device);
        devices.forEach((device) => {
          device.key = device.key === "smart tv" ? "Smart TV" : device.key;
        });
        const dataWithProportions =
          transformers.findProportionsOfMetricFromValue(devices);

        await renderPieChart({
          ref: ref.current,
          data: dataWithProportions,
          width: pieSvgWidth,
        });
      }
    };
    initDevicesChart().catch(console.error);
  }, [deviceData, pieSvgWidth]);

  return (
    <>
      <figure id="pie_chart_device_types" ref={ref}></figure>
    </>
  );
}

DevicesPieChart.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default DevicesPieChart;
