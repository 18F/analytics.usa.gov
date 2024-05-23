import React from "react";
import PropTypes from "prop-types";

/**
 * Creates a select tag with options populated from the provided props. When an
 * option is chosen, the browser is redirected to the page for that agency.
 *
 * @param {String} mainAgencyName the option name to display for the default
 * option in the select.
 * @param {String} agencies a JSON string of an array of objects with slug
 * and name keys. 'slug' is the page path for the agency, and 'name' is the
 * display name for the option.
 * @param {String} pathSuffix a URL path to append to the end of the
 * agency slug.
 */
function AgencySelect({ mainAgencyName, agencies, pathSuffix = "" }) {
  function onChange(event) {
    window.location.assign(
      new URL(window.location.origin + event.target.selectedOptions[0].value),
    );
  }

  const parsedAgencies = JSON.parse(agencies);
  const options = [{ slug: "", name: mainAgencyName }, ...parsedAgencies];
  const currentPath = window.location.pathname;
  const defaultValue =
    currentPath.slice(-1) == "/" ? currentPath.slice(0, -1) : currentPath;

  return (
    <>
      <label className="usa-label" htmlFor="analytics-agency-select">
        Select an agency to display results
      </label>
      <select
        aria-label="Select an agency to display results"
        className="usa-select"
        name="agency-selector"
        id="analytics-agency-select"
        title="Agency Selection Dropdown"
        onChange={onChange}
        defaultValue={defaultValue}
      >
        {options.map((option, index) => {
          let value = option.slug
            ? `/${option.slug}${pathSuffix}`
            : `${pathSuffix}`;
          return (
            <option key={index} value={value}>
              {option.name}
            </option>
          );
        })}
      </select>
    </>
  );
}

AgencySelect.propTypes = {
  mainAgencyName: PropTypes.string.isRequired,
  agencies: PropTypes.string,
  pathSuffix: PropTypes.string,
};

export default AgencySelect;
