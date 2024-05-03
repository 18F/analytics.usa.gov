import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import renderBlock from "../../lib/chart_helpers/renderblock";
import formatters from "../../lib/chart_helpers/formatters";

function EngagementRate({ dataHrefBase }) {
  const dataURL = `${dataHrefBase}/engagement-rate-30-days.json`;
  const ref = useRef(null);

  useEffect(() => {
    // The engagement rate is rounded and formatted to a percentage.
    const initEngagementRateChart = async () => {
      const result = await d3
        .select(ref.current)
        .datum({
          source: dataURL,
          block: ref.current,
        })
        .call(
          renderBlock.loadAndRender().render((selection, data) => {
            const metrics = data.data[0];
            const engagementRate = parseFloat(metrics.engagementRate) * 100;
            selection.text(formatters.floatToPercent(engagementRate));
          }),
        );
      return result;
    };
    initEngagementRateChart().catch(console.error);
  }, []);

  return (
    <>
      <div ref={ref}>
        <div className="data"></div>
      </div>
    </>
  );
}

EngagementRate.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default EngagementRate;
