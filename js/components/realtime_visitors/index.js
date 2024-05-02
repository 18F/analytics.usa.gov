import React from "react";
import { createRoot } from "react-dom/client";
import RealtimeVisitors from "./RealtimeVisitors";

/**
 * Renders an RealtimeVisitors React component, when there is an element on the
 * current page with id '#realtime-visitors-root'.
 *
 * The RealtimeVisitors component will be rendered as a child to the matching
 * element.
 */

const domNode = document.getElementById("realtime-visitors-root");

if (domNode) {
  const root = createRoot(domNode);
  const dataURL = domNode.attributes.getNamedItem("dataurl")?.value;
  const dataPrefix = domNode.attributes.getNamedItem("dataprefix")?.value;
  const agency = domNode.attributes.getNamedItem("agency")?.value;
  root.render(
    <RealtimeVisitors
      dataURL={dataURL}
      dataPrefix={dataPrefix}
      agency={agency}
    />,
  );
}
