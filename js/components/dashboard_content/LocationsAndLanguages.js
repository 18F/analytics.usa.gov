import React from "react";
import PropTypes from "prop-types";

import Config from "../../lib/config";
import TopCitiesRealtime from "./TopCitiesRealtime";
import TopCountriesRealtime from "./TopCountriesRealtime";
import TopLanguagesHistorical from "./TopLanguagesHistorical";
import CardGroup from "../card/CardGroup";
import Card from "../card/Card";
import CardContent from "../card/CardContent";

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
      <CardGroup className="padding-top-2">
        <Card className="card:grid-col-12 desktop:grid-col-4">
          <CardContent className="no-border desktop:padding-right-1">
            <TopCitiesRealtime
              dataHrefBase={dataHrefBase}
              refreshSeconds={Config.realtimeDataRefreshSeconds}
            />
          </CardContent>
        </Card>
        <Card className="card:grid-col-12 desktop:grid-col-4">
          <CardContent className="no-border desktop:padding-x-1">
            <TopCountriesRealtime
              dataHrefBase={dataHrefBase}
              refreshSeconds={Config.realtimeDataRefreshSeconds}
            />
          </CardContent>
        </Card>
        <Card className="card:grid-col-12 desktop:grid-col-4">
          <CardContent className="no-border desktop:padding-left-1">
            <TopLanguagesHistorical dataHrefBase={dataHrefBase} />
          </CardContent>
        </Card>
      </CardGroup>
    </>
  );
}

LocationsAndLanguages.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default LocationsAndLanguages;
