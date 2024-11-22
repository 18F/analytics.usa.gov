import React from "react";
import PropTypes from "prop-types";

/**
 * Creates a select tag with options populated from the provided props. When an
 * option is chosen, the browser is redirected to the page for that agency.
 *
 * @param {object} props the properties for the component
 * @param {string} props.mainAgencyName the option name to display for the
 * default option in the select.
 * @param {string} props.agencies a JSON string of an array of objects with slug
 * and name keys. 'slug' is the page path for the agency, and 'name' is the
 * display name for the option.
 * @param {string} props.pathSuffix a URL path to append to the end of the
 * agency slug.
 * @returns {import('react').ReactElement} The rendered element
 */
function AgencySelect({ mainAgencyName, agencies, pathSuffix = "" }) {
  function onChange(event) {
    window.location.assign(
      new URL(window.location.origin + event.target.selectedOptions[0].value),
    );
  }

  const options = nestAgencies(parseAgencies(agencies, mainAgencyName));
  const currentPath = window.location.pathname;
  const defaultValue =
    currentPath.slice(-1) == "/" ? currentPath.slice(0, -1) : currentPath;

  function parseAgencies(agencies, mainAgencyName) {
    const parsedAgencies = JSON.parse(agencies);
    return [{ slug: "", name: mainAgencyName }, ...parsedAgencies];
  }

  function nestAgencies(agencies) {
    const nestChildren = (parent, list) => {
      parent.children = list.filter((x) => x.parent == parent.slug);
    };

    const topLevel = agencies.filter((x) => x.parent === undefined);
    topLevel.forEach((top) => nestChildren(top, agencies));
    return topLevel;
  }

  return (
    <>
      <label
        className="usa-label text-center margin-y-1"
        htmlFor="analytics-agency-select"
      >
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
        {options.map((option) => {
          let value = option.slug
            ? `/${option.slug}${pathSuffix}`
            : `${pathSuffix}`;

          return (
            <React.Fragment key={option.slug}>
              <option key={option.slug} value={value}>
                {option.name}
              </option>
              {createChildrenOptGroup(option)}
            </React.Fragment>
          );
        })}
      </select>
    </>
  );

  function createChildrenOptGroup(option) {
    if (option.children.length === 0) {
      return;
    }

    return (
      <optgroup
        key={`${option.slug}-children`}
        label={`${option.redirect_from[0].toUpperCase()} Sub-agencies`}
      >
        {option.children.map((child) => {
          return (
            <option key={child.slug} value={`/${child.slug}${pathSuffix}`}>
              {child.name}
            </option>
          );
        })}
      </optgroup>
    );
  }
}

AgencySelect.propTypes = {
  mainAgencyName: PropTypes.string.isRequired,
  agencies: PropTypes.string,
  pathSuffix: PropTypes.string,
};

export default AgencySelect;
