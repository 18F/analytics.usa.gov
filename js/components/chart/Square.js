import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

/**
 * Creates a square svg which is the size of the parent element. The square has
 * a black outline and fill color which is provided via props.
 *
 * @param {object} props the properties for the component
 * @param {string} props.color the color to fill the square
 * @returns {import('react').ReactElement} The rendered element
 */
function Square({ color }) {
  const ref = useRef(null);
  const [svgWidth, setSvgWidth] = useState(null);

  useEffect(() => {
    const initSquare = async () => {
      if (!svgWidth) {
        const resizeObserver = new ResizeObserver((entries) => {
          const element = entries[0].target;
          setSvgWidth(element.getBoundingClientRect().width);
        });
        resizeObserver.observe(ref.current);
      } else {
        const svg = await d3
          .select(ref.current)
          .append("svg")
          .attr("width", svgWidth)
          .attr("height", svgWidth);
        await svg
          .append("rect")
          .attr("width", svgWidth)
          .attr("height", svgWidth)
          .attr("stroke", "black")
          .attr("fill", color);
      }
    };
    initSquare().catch(console.error);
  }, [svgWidth]);

  return (
    <>
      <figure ref={ref}></figure>
    </>
  );
}

Square.propTypes = {
  color: PropTypes.string.isRequired,
};

export default Square;
