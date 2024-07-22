import React from "react";
import PropTypes from "prop-types";

import EngagementRate from "./EngagementRate";
import AverageEngagementDuration from "./AverageEngagementDuration";

/**
 * Contains charts and other data visualizations for the user engagement section
 * of the site. This component is mainly laying out the structure for the
 * section and passes props necessary for getting data and displaying
 * visualizations to child components.
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @returns {import('react').ReactElement} The rendered element
 */
function Engagement({ dataHrefBase }) {
  return (
    <>
      <section id="average_engagement_time" className="desktop:grid-col-6">
        <div className="grid-row">
          <h4 className="grid-col-12">
            <a href="/definitions#report_historical_average_engagement_time">
              Average Engagement Time Per Session
            </a>
          </h4>
        </div>
        <div className="grid-row">
          <span className="grid-col-12">
            <AverageEngagementDuration dataHrefBase={dataHrefBase} />
          </span>
        </div>
      </section>

      <section id="engagement_rate" className="desktop:grid-col-6">
        <div className="grid-row">
          <h4 className="grid-col-12">
            <a href="/definitions#report_historical_engagement_rate">
              Percent of Engaged Sessions
            </a>
          </h4>
        </div>
        <div className="grid-row">
          <span className="data grid-col-12">
            <EngagementRate dataHrefBase={dataHrefBase} />
          </span>
        </div>
      </section>
    </>
  );
}

Engagement.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default Engagement;
