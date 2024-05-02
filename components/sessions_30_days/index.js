import React from "react";
import { createRoot } from "react-dom/client";
import Sessions30Days from "./Sessions30Days";

/**
 * Renders an Sessions30Days React component, when there is an element on the
 * current page with id '#sessions-30-days-root'.
 *
 * The Sessions30Days component will be rendered as a child to the matching
 * element.
 */

const domNode = document.getElementById("sessions-30-days-root");

if (domNode) {
  const root = createRoot(domNode);
  const dataURL = domNode.attributes.getNamedItem("dataurl")?.value;
  const dataPrefix = domNode.attributes.getNamedItem("dataprefix")?.value;
  root.render(<Sessions30Days dataURL={dataURL} dataPrefix={dataPrefix} />);
}
