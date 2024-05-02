import React from "react";
import { createRoot } from "react-dom/client";
import Engagement from "./Engagement";

/**
 * Renders an Engagement React component, when there is an element on the
 * current page with id '#engagement-root'.
 *
 * The Engagement component will be rendered as a child to the matching
 * element.
 */

const domNode = document.getElementById("engagement-root");

if (domNode) {
  const root = createRoot(domNode);
  const dataURL = domNode.attributes.getNamedItem("dataurl").value;
  const dataPrefix = domNode.attributes.getNamedItem("dataprefix")?.value;
  root.render(<Engagement dataURL={dataURL} dataPrefix={dataPrefix} />);
}
