import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import nestCharts from "../../lib/chart_helpers/nest_charts";
import renderBlock from "../../lib/chart_helpers/renderblock";
import transformers from "../../lib/chart_helpers/transformers";
import { isPartOfUnitedStates } from "../../lib/territories";

/**
 * Retrieves the realtime top countries report from the passed data URL and
 * creates a visualization for the count of users visiting sites for the current
 * agency from each country.
 *
 * @param {String} dataHrefBase the URL of the base location of the data to be
 * downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 */
function TopCountriesRealtime({ dataHrefBase }) {
  const dataURL = `${dataHrefBase}/top-countries-realtime.json`;
  const countriesRef = useRef(null);
  const usTerritoriesRef = useRef(null);
  const internationalVisitsRef = useRef(null);

  useEffect(() => {
    const initRealtimeCountriesChart = async () => {
      // Create countries chart
      await d3
        .select(countriesRef.current)
        .datum({
          source: dataURL,
          block: countriesRef.current,
        })
        .call(
          renderBlock.buildBarChart((d) => {
            let totalVisits = 0;
            let USVisits = 0;
            d.data.forEach((c) => {
              totalVisits += parseInt(c.active_visitors, 10);
              if (isPartOfUnitedStates(c.country)) {
                USVisits += parseInt(c.active_visitors, 10);
              }
            });
            const international = totalVisits - USVisits;
            const data = {
              "United States &amp; Territories": USVisits,
              International: international,
            };
            return transformers.findProportionsOfMetricFromValue(
              transformers.listify(data),
            );
          }, "country"),
        );

      // Create us and territories breakdown chart
      await d3
        .select(usTerritoriesRef.current)
        .datum({
          source: dataURL,
          block: usTerritoriesRef.current,
        })
        .call(
          renderBlock.buildBarChartWithLabel((d) => {
            let values = transformers.findProportionsOfMetric(d.data, (list) =>
              list.map((x) => x.active_visitors),
            );
            values = values.filter((c) => isPartOfUnitedStates(c.country));
            return values.slice(0, 3);
          }, "country"),
        );

      // Create international breakdown chart
      await d3
        .select(internationalVisitsRef.current)
        .datum({
          source: dataURL,
          block: internationalVisitsRef.current,
        })
        .call(
          renderBlock.buildBarChartWithLabel((d) => {
            let values = transformers.findProportionsOfMetric(d.data, (list) =>
              list.map((x) => x.active_visitors),
            );
            values = values.filter((c) => !isPartOfUnitedStates(c.country));
            return values.slice(0, 15);
          }, "country"),
        );

      // Sleep for half a second because the above charts are still not loaded
      // for some reason.  TODO: figure out why
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(500);

      // nest the US and territories chart inside the "US"
      // chart once they're both rendered
      await d3
        .select(countriesRef.current)
        .call(
          nestCharts,
          "United States &amp; Territories",
          d3.select(usTerritoriesRef.current),
        );

      // nest the international countries chart inside the "International"
      // chart once they're both rendered
      await d3
        .select(countriesRef.current)
        .call(
          nestCharts,
          "International",
          d3.select(internationalVisitsRef.current),
        );

      return;
    };
    initRealtimeCountriesChart().catch(console.error);
  }, []);

  return (
    <>
      <figure id="chart_us" ref={countriesRef}>
        <div className="data bar-chart"></div>
      </figure>

      <figure
        id="chart_us_and_territories"
        className="hide"
        ref={usTerritoriesRef}
      >
        <h4>United States &amp; Territories</h4>
        <div className="data bar-chart"></div>
      </figure>

      <figure
        id="chart_countries"
        className="hide"
        ref={internationalVisitsRef}
      >
        <h4>International</h4>
        <div className="data bar-chart"></div>
      </figure>
    </>
  );
}

TopCountriesRealtime.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default TopCountriesRealtime;
