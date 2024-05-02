import React from "react";
import { createRoot } from "react-dom/client";
import LocationsAndLanguages from "./LocationsAndLanguages";

/**
 * Renders an LocationsAndLanguages React component, when there is an element on the
 * current page with id '#locations-and-languages-root'.
 *
 * The LocationsAndLanguages component will be rendered as a child to the matching
 * element.
 */

const domNode = document.getElementById("locations-and-languages-root");

if (domNode) {
  const root = createRoot(domNode);
  const dataURL = domNode.attributes.getNamedItem("dataurl").value;
  const dataPrefix = domNode.attributes.getNamedItem("dataprefix")?.value;
  root.render(
    <LocationsAndLanguages dataURL={dataURL} dataPrefix={dataPrefix} />,
  );
}
