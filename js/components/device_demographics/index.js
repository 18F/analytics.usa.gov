import React from "react";
import { createRoot } from "react-dom/client";
import DeviceDemographics from "./DeviceDemographics";

/**
 * Renders an DeviceDemographics React component, when there is an element on the
 * current page with id '#device-demographics-root'.
 *
 * The DeviceDemographics component will be rendered as a child to the matching
 * element.
 */

const domNode = document.getElementById("device-demographics-root");

if (domNode) {
  const root = createRoot(domNode);
  const dataURL = domNode.attributes.getNamedItem("dataurl").value;
  const dataPrefix = domNode.attributes.getNamedItem("dataprefix")?.value;
  root.render(<DeviceDemographics dataURL={dataURL} dataPrefix={dataPrefix} />);
}
