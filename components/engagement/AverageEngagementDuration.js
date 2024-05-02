import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import renderBlock from "../../js/lib/renderblock";
import formatters from "../../js/lib/formatters";

function AverageEngagementDuration({ dataHrefBase }) {
  const dataURL = `${dataHrefBase}/engagement-duration-30-days.json`;
  const ref = useRef(null);

  useEffect(() => {
    // The average engagement duration block is the engagement duration in
    // seconds divided by the number of sessions. The result is rounded and
    // formatted to a readable amount of time.
    const initEngagementDurationChart = async () => {
      const result = await d3
        .select(ref.current)
        .datum({
          source: dataURL,
          block: ref.current,
        })
        .call(
          renderBlock.loadAndRender().render((selection, data) => {
            const metrics = data.data[0];
            const avgEngagementDuration =
              parseInt(metrics.userEngagementDuration) /
              parseInt(metrics.visits);
            selection.text(
              formatters.secondsToReadableTime(avgEngagementDuration),
            );
          }),
        );
      return result;
    };
    initEngagementDurationChart().catch(console.error);
  }, []);

  return (
    <>
      <div ref={ref}>
        <div className="data"></div>
      </div>
    </>
  );
}

AverageEngagementDuration.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default AverageEngagementDuration;
