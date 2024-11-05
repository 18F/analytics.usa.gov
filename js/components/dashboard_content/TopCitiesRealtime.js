import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";

import ChartBuilder from "../../lib/chart_helpers/chart_builder";
import DataLoader from "../../lib/data_loader";
import transformers from "../../lib/chart_helpers/transformers";

/**
 * Retrieves the realtime top cities report from the passed data URL and
 * creates a visualization for the count of users visiting sites for the current
 * agency from each city.
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @param {number} props.refreshSeconds the number of seconds to wait before
 * refreshing chart data.
 * @returns {import('react').ReactElement} The rendered element
 */
function TopCitiesRealtime({ dataHrefBase, refreshSeconds }) {
  const dataURL = `${dataHrefBase}/top-cities-realtime.json`;
  const ref = useRef(null);
  const [realtimeCitiesData, setRealtimeCitiesData] = useState(null);

  useEffect(() => {
    const initRealtimeCitiesChart = async () => {
      if (!realtimeCitiesData) {
        const data = await DataLoader.loadJSON(dataURL);
        await setRealtimeCitiesData(data);
        // Refresh data every interval. useEffect will run and update the chart
        // when the state is changed.
        setInterval(() => {
          DataLoader.loadJSON(dataURL).then((data) => {
            setRealtimeCitiesData(data);
          });
        }, refreshSeconds * 1000);
      } else {
        const chartBuilder = new ChartBuilder();
        await chartBuilder.buildBarChartWithLabel(
          ref.current,
          realtimeCitiesData,
          (d) => {
            const cityList = d.data;
            const cityListFiltered = cityList.filter(
              (c) => c.city !== "(not set)" && c.city !== "zz",
            );
            const proportions = transformers.findProportionsOfMetric(
              cityListFiltered,
              (list) => list.map((x) => x.activeUsers),
            );
            return proportions.slice(0, 13);
          },
          "city",
        );
      }
    };
    initRealtimeCitiesChart().catch(console.error);
  }, [realtimeCitiesData]);

  return (
    <>
      <div className="chart__title">
        <a href="/definitions#dimension_city">Cities</a>
      </div>
      <figure id="chart_top-cities-realtime" ref={ref}>
        <div className="data chart__bar-chart text--capitalize margin-top-4"></div>
      </figure>
    </>
  );
}

TopCitiesRealtime.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
  refreshSeconds: PropTypes.number.isRequired,
};

export default TopCitiesRealtime;
