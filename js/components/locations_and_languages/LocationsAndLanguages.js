import React from "react";
import PropTypes from "prop-types";

import TopCitiesRealtime from "./TopCitiesRealtime";
import TopCountriesRealtime from "./TopCountriesRealtime";
import TopLanguagesHistorical from "./TopLanguagesHistorical";

function LocationsAndLanguages({ dataURL, dataPrefix }) {
  const dataHrefBase = `${dataURL}/${dataPrefix}`;

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
  dataURL: PropTypes.string.isRequired,
  dataPrefix: PropTypes.string.isRequired,
};

export default LocationsAndLanguages;
