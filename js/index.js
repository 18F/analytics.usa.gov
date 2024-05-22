import d3 from "d3";

import gaEventHandler from "./lib/eventhandler";
require("./lib/touchpoints");
require("./lib/react_setup");

gaEventHandler();

// When a link is clicked and the current page becomes the definitions page,
// and there is an anchor in the link; then open the accordion corresponding to
// the anchor if one exists.
window.addEventListener("hashchange", openDefinitionAccordionForAnchor);
window.addEventListener("load", openDefinitionAccordionForAnchor);

function openDefinitionAccordionForAnchor() {
  // Both /definitions and /definitions/ are required here because locally the
  // trailing slash is present for all links for some reason.
  if (
    (window.location.pathname != "/definitions" &&
      window.location.pathname != "/definitions/") ||
    window.location.hash == ""
  ) {
    return;
  }

  const accordionButtonWrapper = d3.select(window.location.hash);
  if (hasChildElement(accordionButtonWrapper)) {
    const accordionButton = accordionButtonWrapper[0][0].children[0];
    if (accordionButton.ariaExpanded == "false") {
      accordionButton.click();
    }
  }
}

function hasChildElement(d3Selection) {
  return (
    !!d3Selection &&
    Array.isArray(d3Selection) &&
    Array.isArray(d3Selection[0]) &&
    !!d3Selection[0][0].children &&
    !!d3Selection[0][0].children[0]
  );
}
