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

  /**
   * Sends a DAP analytics event when an accordion button is expanded or
   * collapsed.
   *
   * @param {object} clickEvent the event which expanded or collapsed the
   * accordion section.
   */
  function accordionButtonClickHandler(clickEvent) {
    const section = clickEvent.target.innerText;
    let selection;

    // Selection should be the opposite of the current ariaExpanded value;
    if (clickEvent.target.ariaExpanded == "true") {
      selection = false;
    } else if (clickEvent.target.ariaExpanded == "false") {
      selection = true;
    }

    const accordionEvent = { section, selection };
    window.gas4("accordion_click", accordionEvent);
  }

  return (
    <HeaderTag id={id} className={`usa-accordion__heading ${className}`}>
      {React.cloneElement(children, { onClick: accordionButtonClickHandler })}
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
