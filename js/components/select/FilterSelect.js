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
 * @param {string} props.className the class names to append to the rendered
 * element.
 * @returns {import('react').ReactElement} The rendered element
 */
function FilterSelect({
  filters,
  defaultFilterValue,
  onChange,
  name,
  className = "",
}) {
  const [selectedFilter, setSelectedFilter] = useState(defaultFilterValue);

  useEffect(() => {
    onChange(selectedFilter);
  }, [selectedFilter]);

  return (
    <select
      className={`usa-select chart__filter margin-top-0 ${className}`}
      value={selectedFilter}
      onChange={(e) => setSelectedFilter(e.target.value)}
      aria-label={name}
    >
      {filters.map((filter, index) => {
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
  className: PropTypes.string,
};

export default FilterSelect;
