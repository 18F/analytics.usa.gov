import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import renderBlock from "../../lib/chart_helpers/renderblock";
import formatters from "../../lib/chart_helpers/formatters";

function Visitors30Days({ dataHrefBase }) {
  // This was using devices 30 days and setting this value as a side effect of
  // creating the devices chart.  users.json is 90 days, so just stick with
  // devices.json for now.
  const reportURL = `${dataHrefBase}/devices.json`;
  const ref = useRef(null);

  useEffect(() => {
    const initVisitors30DaysChart = async () => {
      const result = await d3
        .select(ref.current)
        .datum({
          source: reportURL,
          block: ref.current,
        })
        .call(
          renderBlock.loadAndRender().render((selection, data) => {
            const total = data.totals.visits;
            selection.text(formatters.readableBigNumber(total));
          }),
        );
      return result;
    };
    initVisitors30DaysChart().catch(console.error);
  });

  return (
    <div ref={ref}>
      There were{" "}
      <span id="total_visitors" className="data">
        ...
      </span>{" "}
      sessions in the last 30 days.
    </div>
  );
}

Visitors30Days.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default Visitors30Days;
