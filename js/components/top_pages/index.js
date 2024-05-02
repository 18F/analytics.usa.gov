import React from "react";
import { createRoot } from "react-dom/client";
import TopPages from "./TopPages";

/**
 * Renders an TopPages React component, when there is an element on the
 * current page with id '#top-pages-root'.
 *
 * The TopPages component will be rendered as a child to the matching
 * element.
 */

const domNode = document.getElementById("top-pages-root");

if (domNode) {
  const root = createRoot(domNode);
  const dataURL = domNode.attributes.getNamedItem("dataurl").value;
  const dataPrefix = domNode.attributes.getNamedItem("dataprefix")?.value;
  root.render(<TopPages dataURL={dataURL} dataPrefix={dataPrefix} />);
}
