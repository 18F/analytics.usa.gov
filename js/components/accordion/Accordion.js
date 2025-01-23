import React from "react";
import PropTypes from "prop-types";

/**
 * Wrapper react component which creates a USWDS accordion component.
 *
 * @param {object} props the properties for the component.
 * @param {import('react').ReactNode} props.children the wrapped elements.
 * @param {string} props.id the id to add to the rendered element.
 * @param {string} props.className the class names to append to the rendered
 * element.
 * @param {boolean} props.multiselect true if the accordion should allow
 * multiple selections to be open.
 * @returns {import('react').ReactElement} The rendered element
 */
function Accordion({
  children,
  id = null,
  className = "",
  multiselect = false,
}) {
  return (
    <div
      id={id}
      className={`usa-accordion${multiselect ? " usa-accordion--multiselectable" : ""} ${className}`}
      data-allow-multiple={multiselect}
    >
      {children}
    </div>
  );
}

Accordion.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
  multiselect: PropTypes.bool,
};

export default Accordion;
