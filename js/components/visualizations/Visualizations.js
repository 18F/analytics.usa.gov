import React, { useState } from "react";
import PropTypes from "prop-types";

import TopPagesCircleGraph from "./TopPagesCircleGraph";
import FilterSelect from "../select/FilterSelect";

/**
 * Contains data visualizations intended to be for an entire page
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataURL the URL of the base location of the data to be
 * displayed In production this is proxied and redirected to the S3 bucket URL
 * by NGINX.
 * @param {string} props.mainAgencyName the option name to display for the default
 * option in the select.
 * @param {string} props.agencies a JSON string of an array of objects with
 * slug, name, and api_v1 keys. 'slug' is the API name for the agency, 'name' is
 * the display name for the option, and 'api_v1' is true if the agency is valid
 * for the DAP API version 1.
 * @returns {import('react').ReactElement} The rendered element
 */
function Visualizations({ dataURL, mainAgencyName, agencies }) {
  const parsedAgencies = JSON.parse(agencies).map(({ name, slug }) => {
    return [name, slug];
  });
  parsedAgencies.sort((a, b) => a[0].localeCompare(b[0]));
  const agencyFilters = [[mainAgencyName, "live"], ...parsedAgencies];
  const [currentAgencyFilter, setCurrentAgencyFilter] = useState(
    agencyFilters[0],
  );

  async function filterChangeHandler(agencyPath) {
    if (!agencyPath) return;

    const selectedFilter = agencyFilters.find((agencyFilter) => {
      return agencyFilter[1] == agencyPath;
    });
    await setCurrentAgencyFilter(selectedFilter);
  }

  return (
    <>
      <div
        id="visualizations-subheader"
        className="grid-row padding-2 bg-very-light-gray"
      >
        <div className="grid-col-12 analytics-select analytics-select--main">
          <label
            className="usa-label margin-y-1 padding-bottom-1"
            htmlFor="visualizations-agency-select"
          >
            Select an agency to filter visualizations
          </label>
          <FilterSelect
            filters={agencyFilters}
            defaultFilterValue={agencyFilters[0][1] || ""}
            onChange={filterChangeHandler}
            name={"agency filter"}
            className="width-auto maxw-full text--overflow-ellipsis"
            id="visualizations-agency-select"
          />
        </div>
      </div>
      <div className="padding-2">
        <div className="grid-row">
          <div className="grid-col-12">
            <h1 className="margin-top-0 text--semibold">
              {currentAgencyFilter[0] == mainAgencyName
                ? "U.S. Federal Government"
                : currentAgencyFilter[0]}{" "}
              Website and App Analytics
            </h1>
          </div>
        </div>
        <TopPagesCircleGraph
          dataHrefBase={`${dataURL}/${currentAgencyFilter[1]}`}
        ></TopPagesCircleGraph>
      </div>
    </>
  );
}

Visualizations.propTypes = {
  dataURL: PropTypes.string.isRequired,
  mainAgencyName: PropTypes.string.isRequired,
  agencies: PropTypes.string.isRequired,
};

export default Visualizations;
