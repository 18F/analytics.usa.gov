import React from "react";
import PropTypes from "prop-types";

import TotalUsers from "./TotalUsers";
import TotalPageViews from "./TotalPageViews";

/**
 * Contains charts and other data visualizations for the user TotalViewsAndUsers section
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
function TotalViewsAndUsers({ dataHrefBase }) {
  return (
    <div className="grid-row">
      <section id="total-views" className="desktop:grid-col-6 text--centered">
        <div className="grid-row">
          <div className="chart__title text--centered grid-col-12">
            Total Views (Page or App Screen)
          </div>
        </div>
        <div className="grid-row">
          <span className="grid-col-12">
            <TotalPageViews dataHrefBase={dataHrefBase} />
          </span>
        </div>
      </section>

      <section id="total-users" className="desktop:grid-col-6 text--centered">
        <div className="grid-row">
          <div className="chart__title text--centered grid-col-12">
            Total Users
          </div>
        </div>
        <div className="grid-row">
          <span className="data grid-col-12">
            <TotalUsers dataHrefBase={dataHrefBase} />
          </span>
        </div>
      </section>
    </div>
  );
}

TotalViewsAndUsers.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default TotalViewsAndUsers;
