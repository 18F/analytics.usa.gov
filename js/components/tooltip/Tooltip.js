import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import tooltip from "@uswds/uswds/js/usa-tooltip";

/**
 * Wrapper react component which creates a USWDS tooltip component.
 *
 * Note: this doesn't work when a child element is an anchor tag. Needs more
 * investigation to determine why.
 *
 * @param {object} props the properties for the component.
 * @param {import('react').ReactNode} props.children the wrapped elements.
 * @param {string} props.id the id to add to the rendered element.
 * @param {string} props.className the class names to append to the rendered
 * element.
 * @param {string} props.position the position to display the tooltip relative
 * to the element. (top, bottom, left, or right).
 * @param {string} props.content the text to display within the tooltip.
 * @returns {import('react').ReactElement} The rendered element
 */
function Tooltip({ children, id = null, className = "", position, content }) {
  const ref = useRef(null);

  useEffect(() => {
    tooltip.on(ref.current);

    return () => {
      tooltip.off();
    };
  }, []);

  return (
    <span
      id={id}
      className={`usa-tooltip ${className}`}
      data-position={position}
      title={content}
      ref={ref}
    >
      {children}
    </span>
  );
}

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string,
  className: PropTypes.string,
  position: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

export default Tooltip;
