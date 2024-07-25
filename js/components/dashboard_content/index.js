import React from "react";
import { createRoot } from "react-dom/client";
import DashboardContent from "./DashboardContent";

/**
 * Renders an DashboardContent React component, when there is an element on the
 * current page with id 'dashboard-content-root'.
 *
 * The DashboardContent component will be rendered as a child to the matching
 * element.
 */

const domNode = document.getElementById("dashboard-content-root");

if (domNode) {
  const root = createRoot(domNode);
  const dataURL = domNode.attributes.getNamedItem("dataurl").value;
  const dataPrefix = domNode.attributes.getNamedItem("dataprefix")?.value;
  const agency = domNode.attributes.getNamedItem("agency")?.value;
  root.render(
    <DashboardContent
      dataURL={dataURL}
      dataPrefix={dataPrefix}
      agency={agency ? agency : "U.S. Federal Government"}
    />,
  );
}
