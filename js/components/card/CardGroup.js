import React from "react";
import PropTypes from "prop-types";

/**
 * Wrapper react component which creates a USWDS card group component.
 *
 * @param {object} props the properties for the component.
 * @param {import('react').ReactNode} props.children the wrapped elements.
 * @param {string} props.id the id to add to the rendered element.
 * @param {string} props.className the class names to append to the rendered
 * element.
 * @returns {import('react').ReactElement} The rendered element
 */
function CardGroup({ children, id = null, className = "" }) {
  return (
    <ul id={id} className={`usa-card-group ${className}`}>
      {children}
    </ul>
  );
}

CardGroup.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
};

export default CardGroup;
