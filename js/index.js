import d3 from "d3";
import * as Q from "q";

import gaEventHandler from "./lib/eventhandler";
import BLOCKS from "./lib/blocks";
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

// store a promise for each block
const PROMISES = {};

/*
 * Now, initialize all of the blocks by:
 *
 * 1. grabbing their data-block attribute
 * 2. looking up the block id in our `BLOCKS` object, and
 * 3. if a renderer exists, calling it on the selection
 */
d3.selectAll("*[data-source]").each(function () {
  const blockId = this.getAttribute("data-block");
  const block = BLOCKS[blockId];
  if (!block) {
    return console.warn("no block registered for: %s", blockId);
  }

  // each block's promise is resolved when the block renders
  PROMISES[blockId] = Q.Promise((resolve, reject) => {
    block.on("render.promise", resolve);
    block.on("error.promise", reject);
  });

  return d3
    .select(this)
    .datum({
      source: this.getAttribute("data-source"),
      block: blockId,
    })
    .call(block);
});
