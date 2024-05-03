import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import buildTimeSeries from "../../lib/chart_helpers/timeseries";
import renderBlock from "../../lib/chart_helpers/renderblock";
import formatters from "../../lib/chart_helpers/formatters";

function Sessions30Days({ dataHrefBase }) {
  const reportURL = `${dataHrefBase}/sessions-over-30-days.json`;
  const ref = useRef(null);

  useEffect(() => {
    const initSessions30DaysChart = async () => {
      const result = await d3
        .select(ref.current)
        .datum({
          source: reportURL,
          block: ref.current,
        })
        .call(
          renderBlock
            .loadAndRender()
            .transform((data) => data)
            .render((svg, data) => {
              const days = data.data;
              days.forEach((d) => {
                d.visits = +d.visits;
              });

              const y = function (d) {
                return d.visits;
              };

              const series = buildTimeSeries()
                .series([data.data])
                .y(y)
                .label((d) => formatters.formatDate(d.date))
                .title(
                  (d) =>
                    `${formatters.addCommas(d.visits)} visits during the day of ${d.date}`,
                );

              series.xScale().domain(d3.range(0, days.length + 1));

              series.yScale().domain([0, d3.max(days, y)]);

              series.yAxis().tickFormat(formatters.formatVisits());

              svg.call(series);
            }),
        );
      return result;
    };
    initSessions30DaysChart().catch(console.error);
  });

  return (
    <div
      id="time_series"
      className="section__chart"
      data-refresh="15"
      ref={ref}
    >
      <svg className="data time-series"></svg>
    </div>
  );
}

Sessions30Days.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default Sessions30Days;
