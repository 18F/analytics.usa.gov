import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

import DataLoader from "../../lib/data_loader";
import renderPieChart from "../../lib/chart_helpers/pie_chart";
import transformers from "../../lib/chart_helpers/transformers";

/**
 * Retrieves the OperatingSystems report from the passed data URL and creates a
 * visualization for the breakdown of OperatingSystems of users visiting sites for the
 * current agency.
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @returns {import('react').ReactElement} The rendered element
 */
function OperatingSystemsPieChart({ dataHrefBase }) {
  const dataURL = `${dataHrefBase}/os.json`;
  const ref = useRef(null);
  const [osData, setOsData] = useState(null);
  const [pieSvgWidth, setPieSvgWidth] = useState(null);

  useEffect(() => {
    const initOsChart = async () => {
      if (!pieSvgWidth) {
        const resizeObserver = new ResizeObserver((entries) => {
          console.log(entries[0].target.getBoundingClientRect().width);
          const element = entries[0].target;
          setPieSvgWidth(element.getBoundingClientRect().width);
        });
        resizeObserver.observe(ref.current);
      }
      if (!osData) {
        const data = await DataLoader.loadJSON(dataURL);
        await setOsData(data);
      } else {
        const operatingSystems = transformers.listify(osData.totals.by_os);
        const dataWithProportions =
          transformers.findProportionsOfMetricFromValue(operatingSystems);

        await renderPieChart({
          ref: ref.current,
          data: dataWithProportions,
          width: pieSvgWidth,
        });
      }
    };
    initOsChart().catch(console.error);
  }, [osData, pieSvgWidth]);

  return (
    <>
      <figure id="pie_chart_device_types" ref={ref}></figure>
    </>
  );
}

OperatingSystemsPieChart.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default OperatingSystemsPieChart;
