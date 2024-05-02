import React from "react";
import { createRoot } from "react-dom/client";
import TrafficSources from "./TrafficSources";

/**
 * Renders an TrafficSources React component, when there is an element on the
 * current page with id '#traffic-sources-root'.
 *
 * The TrafficSources component will be rendered as a child to the matching
 * element.
 */

const domNode = document.getElementById("traffic-sources-root");

if (domNode) {
  const root = createRoot(domNode);
  const dataURL = domNode.attributes.getNamedItem("dataurl").value;
  const dataPrefix = domNode.attributes.getNamedItem("dataprefix")?.value;
  root.render(<TrafficSources dataURL={dataURL} dataPrefix={dataPrefix} />);
}
