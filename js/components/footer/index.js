import React from "react";
import { createRoot } from "react-dom/client";
import Footer from "./Footer";

/**
 * Renders an Footer React component, when there is an element on the
 * current page with id 'footer-root'.
 *
 * The Footer component will be rendered as a child to the matching
 * element.
 */

const domNode = document.getElementById("footer-root");

if (domNode) {
  const root = createRoot(domNode);
  const siteDomain = domNode.attributes.getNamedItem("sitedomain").value;
  root.render(<Footer siteDomain={siteDomain} />);
}
