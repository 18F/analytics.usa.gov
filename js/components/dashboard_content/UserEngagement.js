import React from "react";
import PropTypes from "prop-types";

import EngagementRate from "./EngagementRate";
import AverageEngagementDuration from "./AverageEngagementDuration";
import FileDownloads from "./FileDownloads";

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
function UserEngagement({ dataHrefBase }) {
  return (
    <>
      <div className="grid-row padding-top-3">
        <div
          id="average_engagement_time"
          className="desktop:grid-col-6 text--centered"
        >
          <AverageEngagementDuration dataHrefBase={dataHrefBase} />
        </div>

        <div id="engagement_rate" className="desktop:grid-col-6 text--centered">
          <EngagementRate dataHrefBase={dataHrefBase} />
        </div>
      </div>

      <div className="grid-row">
        <div className="grid-col-12">
          <FileDownloads dataHrefBase={dataHrefBase} />
        </div>
      </div>
    </>
  );
}

UserEngagement.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default UserEngagement;
