import React from "react";
import PropTypes from "prop-types";

/**
 * Wrapper react component which creates a USWDS card container component.
 *
 * @param {object} props the properties for the component.
 * @param {import('react').ReactNode} props.children the wrapped elements.
 * @param {string} props.className the class names to append to the rendered
 * element.
 * @returns {import('react').ReactElement} The rendered element
 */
function CardContent({ children, className = "" }) {
  return <div className={`usa-card__container ${className}`}>{children}</div>;
}

CardContent.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default CardContent;
