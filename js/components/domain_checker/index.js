/**
 * Renders an DomainChecker React component, when there is an element on the
 * current page with id 'domain-checker-root'.
 *
 * The DomainChecker component will be rendered as a child to the matching
 * element.
 */
import { createRoot } from "react-dom/client";
import DomainChecker from "./DomainChecker";
import React from "react";

const domNode = document.getElementById("domain-checker-root");

if (domNode) {
  const root = createRoot(domNode);
  const subpropertyFilters = domNode.attributes.getNamedItem("subpropertyFilters").value;
  const properties = domNode.attributes.getNamedItem("properties").value;
  root.render(<DomainChecker subpropertyFilters={subpropertyFilters} properties={properties} />);
}
