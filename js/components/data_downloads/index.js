import React from "react";
import { createRoot } from "react-dom/client";
import DataDownloads from "./DataDownloads";

/**
 * Renders an DataDownloads React component, when there is an element on the
 * current page with id 'data-downloads-root'.
 *
 * The DataDownloads component will be rendered as a child to the matching
 * element.
 */

const domNode = document.getElementById("data-downloads-root");

if (domNode) {
  const root = createRoot(domNode);
  const dataURL = domNode.attributes.getNamedItem("dataurl").value;
  const dataPrefix = domNode.attributes.getNamedItem("dataprefix")?.value;
  root.render(<DataDownloads dataURL={dataURL} dataPrefix={dataPrefix} />);
}
