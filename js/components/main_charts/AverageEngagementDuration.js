import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import renderBlock from "../../lib/chart_helpers/renderblock";
import formatters from "../../lib/chart_helpers/formatters";

/**
 * Retrieves the engagement duration report from the passed data URL and creates
 * a visualization for the average engagement duration of users for the
 * current agency. The average duration is calculated by taking the total user
 * engagement duration and dividing by the number of visits.
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @returns {import('react').ReactElement} The rendered element
 */
function AverageEngagementDuration({ dataHrefBase }) {
  const dataURL = `${dataHrefBase}/engagement-duration-30-days.json`;
  const ref = useRef(null);

  useEffect(() => {
    /**
     * The average engagement duration block is the engagement duration in
     * seconds divided by the number of sessions. The result is rounded and
     * formatted to a readable amount of time.
     *
     * @returns {Promise} resolves when render is complete
     */
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
