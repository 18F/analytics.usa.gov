import React from "react";
import PropTypes from "prop-types";

import TopCitiesRealtime from "./TopCitiesRealtime";
import TopCountriesRealtime from "./TopCountriesRealtime";
import TopLanguagesHistorical from "./TopLanguagesHistorical";

/**
 * Contains charts and other data visualizations for the user locations and
 * languages section of the site. This component is mainly laying out the
 * structure for the section and passes props necessary for getting data and
 * displaying visualizations to child components.
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @returns {import('react').ReactElement} The rendered element
 */
function LocationsAndLanguages({ dataHrefBase }) {
  return (
    <>
      <div className="section__headline">
        <h2>User Locations and Languages in the Last 30 Minutes</h2>
      </div>

      <div className="section__chart grid-row">
        <section
          id="cities"
          className="desktop:grid-col-4 padding-2 bar-chart-component"
        >
          <h4>Cities</h4>
          <TopCitiesRealtime dataHrefBase={dataHrefBase} />
        </section>

        <section
          id="countries"
          className="desktop:grid-col-4 padding-2 bar-chart-component"
        >
          <h4>Countries</h4>
          <TopCountriesRealtime dataHrefBase={dataHrefBase} />
        </section>

        <section
          id="languages"
          className="desktop:grid-col-4 padding-2 bar-chart-component"
        >
          <h4>Languages</h4>
          <TopLanguagesHistorical dataHrefBase={dataHrefBase} />
        </section>
      </div>
    </>
  );
}

LocationsAndLanguages.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default LocationsAndLanguages;
