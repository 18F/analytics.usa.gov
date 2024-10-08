import React from "react";
import PropTypes from "prop-types";

import Config from "../../lib/config";
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
        <a href="/definitions#report_realtime_locations_languages">
          User Locations and Languages in the Last 30 Minutes
        </a>
      </div>

      <div className="padding-top-4 grid-row">
        <div id="cities" className="desktop:grid-col-4 desktop:padding-right-2">
          <TopCitiesRealtime
            dataHrefBase={dataHrefBase}
            refreshSeconds={Config.realtimeDataRefreshSeconds}
          />
        </div>

        <div id="countries" className="desktop:grid-col-4 desktop:padding-x-2">
          <TopCountriesRealtime
            dataHrefBase={dataHrefBase}
            refreshSeconds={Config.realtimeDataRefreshSeconds}
          />
        </div>

        <div
          id="languages"
          className="desktop:grid-col-4 desktop:padding-left-2"
        >
          <TopLanguagesHistorical dataHrefBase={dataHrefBase} />
        </div>
      </div>
    </>
  );
}

LocationsAndLanguages.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default LocationsAndLanguages;
