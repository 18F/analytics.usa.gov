import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import renderBlock from "../../lib/chart_helpers/renderblock";
import transformers from "../../lib/chart_helpers/transformers";

function TopCitiesRealtime({ dataHrefBase }) {
  const dataURL = `${dataHrefBase}/top-cities-realtime.json`;
  const ref = useRef(null);

  useEffect(() => {
    const initRealtimeCitiesChart = async () => {
      const result = await d3
        .select(ref.current)
        .datum({
          source: dataURL,
          block: ref.current,
        })
        .call(
          renderBlock.buildBarChartWithLabel((d) => {
            const cityList = d.data;
            const cityListFiltered = cityList.filter(
              (c) => c.city !== "(not set)" && c.city !== "zz",
            );
            const proportions = transformers.findProportionsOfMetric(
              cityListFiltered,
              (list) => list.map((x) => x.active_visitors),
            );
            return proportions.slice(0, 13);
          }, "city"),
        );
      return result;
    };
    initRealtimeCitiesChart().catch(console.error);
  }, []);

  return (
    <figure
      id="chart_top-cities-90-days"
      data-source={dataURL}
      data-refresh="15"
      ref={ref}
    >
      <div className="data bar-chart"></div>
    </figure>
  );
}

TopCitiesRealtime.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default TopCitiesRealtime;
