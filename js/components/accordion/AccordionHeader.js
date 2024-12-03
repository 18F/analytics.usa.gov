import React from "react";
import PropTypes from "prop-types";

/**
 * Wrapper react component which creates a USWDS accordion header component.
 *
 * @param {object} props the properties for the component.
 * @param {import('react').ReactNode} props.children the wrapped elements.
 * @param {string} props.id the id to add to the rendered element.
 * @param {string} props.className the class names to append to the rendered
 * element.
 * @param {string} props.headingLevel the level of header tag to use.
 * @returns {import('react').ReactElement} The rendered element
 */
function AccordionHeader({
  children,
  id = null,
  className = "",
  headingLevel = 2,
}) {
  const HeaderTag = `h${headingLevel}`;
  return (
    <HeaderTag id={id} className={`usa-accordion__heading ${className}`}>
      {children}
    </HeaderTag>
  );
}

AccordionHeader.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
  headingLevel: PropTypes.number,
};

export default AccordionHeader;
