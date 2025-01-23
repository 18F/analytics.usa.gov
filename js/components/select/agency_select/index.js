import React from "react";
import { createRoot } from "react-dom/client";
import AgencySelect from "./AgencySelect";

/**
 * Renders an AnalyticsSelect React component, when there is an element on the
 * current page with id 'analytics-agency-select-root'.
 *
 * The AgencySelect component will be rendered as a child to the matching
 * element.
 */

const domNode = document.getElementById("analytics-agency-select-root");

if (domNode) {
  const root = createRoot(domNode);
  const mainAgencyName =
    domNode.attributes.getNamedItem("mainagencyname").value;
  const agencies = domNode.attributes.getNamedItem("agencies").value;
  const pathSuffix = domNode.attributes.getNamedItem("pathsuffix")?.value;
  root.render(
    <AgencySelect
      mainAgencyName={mainAgencyName}
      agencies={agencies}
      pathSuffix={pathSuffix}
    />,
  );
}
