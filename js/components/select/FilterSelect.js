import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

/**
 * Creates a select tag with options populated from the provided props. When an
 * option is chosen, the browser is redirected to the page for that agency.
 *
 * @param {object} props the properties for the component
 * @param {string[][]} props.filters the name and value of each filter option.
 * @param {string} props.defaultFilterValue the value of the option which should
 * be selected by default.
 * @param {Function} props.onChange a function to call when the selected option
 * is changed.
 * @param {string} props.name an accessible name for the select element.
 * @returns {import('react').ReactElement} The rendered element
 */
function FilterSelect({ filters, defaultFilterValue, onChange, name }) {
  const [selectedFilter, setSelectedFilter] = useState(defaultFilterValue);
  const sortedFilters = filters.sort((a, b) => {
    // Sort by display name, which is array index 0
    if (a[0] < b[0]) {
      return -1;
    } else if (a[0] > b[0]) {
      return 1;
    }
    return 0;
  });

  useEffect(() => {
    onChange(selectedFilter);
  }, [selectedFilter]);

  return (
    <select
      className="usa-select chart__filter"
      value={selectedFilter}
      onChange={(e) => setSelectedFilter(e.target.value)}
      aria-label={name}
    >
      {sortedFilters.map((filter, index) => {
        return (
          <option key={index} value={filter[1]}>
            {filter[0]}
          </option>
        );
      })}
    </select>
  );
}

FilterSelect.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  defaultFilterValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
};

export default FilterSelect;