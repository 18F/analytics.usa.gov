import formatters from "./formatters";

/**
 * nested chart helper function:
 *
 * 1. finds the selection's `.bin` child with data matching the parentFilter
 *    function (the "parent bin")
 * 2. determines that bin's share of the total (if `data-scale-to-parent` is "true")
 * 3. grabs all of the child `.bin`s of the child selection and updates their
 *    share (by multiplying it by the parent's)
 * 4. updates the `.bar` width  and `.value` text for each child bin
 * 5. moves the child node into the parent bin
 *
 * @param {Object} selection a D3 selected parent chart.
 * @param {String} key the key in the parent chart to nest within.
 * @param {Object} child a D3 selected child chart to nest under the key.
 */
export default function nestCharts(selection, key, child) {
  const parentFilter = (d) => d.key === key;
  const parent = selection.selectAll(".bin").filter(parentFilter);

  // Display and nest a sub-section if an entry exists in the parent chart
  if (
    parent &&
    parent[0] &&
    parent[0].parentNode.innerHTML.includes(key) &&
    child[0]
  ) {
    const scale = child.attr("data-scale-to-parent") === "true";

    child[0][0].classList.remove("hide");

    const bins = child
      .selectAll(".bin")
      // If the child data should be scaled to be %'s of its parent bin,
      // then multiple each child item's % share by its parent's % share.
      .each((d) => {
        if (scale) d.proportion *= parent.datum().proportion / 100;
      })
      .attr("data-share", (d) => d.proportion);

    // XXX we *could* call the renderer again here, but this works, so...
    bins.select(".bar").style("width", (d) => `${d.proportion.toFixed(1)}%`);
    bins.select(".value").text((d) => formatters.floatToPercent(d.proportion));

    parent.node().appendChild(child.node());
  }
}
