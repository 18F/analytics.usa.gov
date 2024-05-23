import React from "react";
import { createRoot } from "react-dom/client";
import HistoricalDataDownload from "./HistoricalDataDownload";

/**
 * Renders an HistoricalDataDownloads React component, when there is an element on the
 * current page with id 'historical-data-download-root'.
 *
 * The HistoricalDataDownloads component will be rendered as a child to the matching
 * element.
 */

const domNode = document.getElementById("historical-data-download-root");

if (domNode) {
  const root = createRoot(domNode);
  const apiURL = domNode.attributes.getNamedItem("apiurl").value;
  const mainAgencyName =
    domNode.attributes.getNamedItem("mainagencyname").value;
  const agencies = domNode.attributes.getNamedItem("agencies").value;
  root.render(
    <HistoricalDataDownload
      apiURL={apiURL}
      mainAgencyName={mainAgencyName}
      agencies={agencies}
    />,
  );
}
