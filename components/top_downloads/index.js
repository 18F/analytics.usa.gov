import React from "react";
import { createRoot } from "react-dom/client";
import TopDownloads from "./TopDownloads";

/**
 * Renders an TopDownloads React component, when there is an element on the
 * current page with id '#top-downloads-root'.
 *
 * The TopDownloads component will be rendered as a child to the matching
 * element.
 */

const domNode = document.getElementById("top-downloads-root");

if (domNode) {
  const root = createRoot(domNode);
  const dataURL = domNode.attributes.getNamedItem("dataurl")?.value;
  const dataPrefix = domNode.attributes.getNamedItem("dataprefix")?.value;
  root.render(<TopDownloads dataURL={dataURL} dataPrefix={dataPrefix} />);
}
