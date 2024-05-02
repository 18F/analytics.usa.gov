import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import renderBlock from "../../js/lib/renderblock";

function TopSourceMedia({ dataHrefBase }) {
  const dataURL = `${dataHrefBase}/top-session-source-medium-30-days.json`;
  const ref = useRef(null);

  useEffect(() => {
    const initTopSourceMediaChart = async () => {
      const result = await d3
        .select(ref.current)
        .datum({
          source: dataURL,
          block: ref.current,
        })
        .call(renderBlock.buildCompactBarChart("session_source_medium"));
      return result;
    };
    initTopSourceMediaChart().catch(console.error);
  }, []);

  return (
    <figure id="chart_session_source_medium" ref={ref}>
      <div className="data bar-chart"></div>
    </figure>
  );
}

TopSourceMedia.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default TopSourceMedia;
