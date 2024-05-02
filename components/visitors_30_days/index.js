import React from "react";
import { createRoot } from "react-dom/client";
import Visitors30Days from "./Visitors30Days";

/**
 * Renders an Visitors30Days React component, when there is an element on the
 * current page with id '#visitors-30-days-root'.
 *
 * The Visitors30Days component will be rendered as a child to the matching
 * element.
 */

const domNode = document.getElementById("visitors-30-days-root");

if (domNode) {
  const root = createRoot(domNode);
  const dataURL = domNode.attributes.getNamedItem("dataurl")?.value;
  const dataPrefix = domNode.attributes.getNamedItem("dataprefix")?.value;
  root.render(<Visitors30Days dataURL={dataURL} dataPrefix={dataPrefix} />);
}
