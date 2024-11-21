import React from "react";
import PropTypes from "prop-types";

/**
 * Wrapper react component which creates a USWDS card component.
 *
 * @param {object} props the properties for the component.
 * @param {import('react').ReactNode} props.children the wrapped elements.
 * @param {string} props.className the class names to append to the rendered
 * element.
 * @returns {import('react').ReactElement} The rendered element
 */
function Card({ children, className = "" }) {
  return <li className={`usa-card ${className}`}>{children}</li>;
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;