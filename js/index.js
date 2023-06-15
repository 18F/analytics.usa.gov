import d3 from 'd3';
import * as Q from 'q';

import gaEventHandler from './lib/eventhandler';
import consolePrint from './lib/consoleprint';
import formatters from './lib/formatters';
import BLOCKS from './lib/blocks';

gaEventHandler();

// store a promise for each block
const PROMISES = {};

function whenRendered(blockIds, callback) {
  const promises = blockIds.map((id) => PROMISES[id]);
  return Q.all(promises).then(callback);
}

/*
   * nested chart helper function:
   *
   * 1. finds the selection's `.bin` child with data matching the parentFilter
   *    function (the "parent bin")
   * 2. determines that bin's share of the total (if `data-scale-to-parent` is "true")
   * 3. grabs all of the child `.bin`s of the child selection and updates their
   *    share (by multiplying it by the parent's)
   * 4. updates the `.bar` width  and `.value` text for each child bin
   * 5. moves the child node into the parent bin
   */
function nestCharts(selection, key, child) {
  const parentFilter = (d) => d.key === key;

  const parent = selection.selectAll('.bin')
    .filter(parentFilter);

  const scale = (child.attr('data-scale-to-parent') === 'true');

  // Display and nest a sub-section if an entry exists in the parent chart
  if (parent && parent[0].parentNode.innerHTML.includes(key) && child[0]) {
    child[0][0].classList.remove('hide');
  }

  const bins = child.selectAll('.bin')
    // If the child data should be scaled to be %'s of its parent bin,
    // then multiple each child item's % share by its parent's % share.
    .each((d) => {
      if (scale) d.proportion *= (parent.datum().proportion / 100);
    })
    .attr('data-share', (d) => d.proportion);

  // XXX we *could* call the renderer again here, but this works, so...
  bins.select('.bar')
    .style('width', (d) => `${(d.proportion).toFixed(1)}%`);
  bins.select('.value')
    .text((d) => formatters.floatToPercent(d.proportion));

  parent.node().appendChild(child.node());
}

/*
   * Now, initialize all of the blocks by:
   *
   * 1. grabbing their data-block attribute
   * 2. looking up the block id in our `BLOCKS` object, and
   * 3. if a renderer exists, calling it on the selection
   */
d3.selectAll('*[data-source]')
  .each(function () {
    const blockId = this.getAttribute('data-block');
    const block = BLOCKS[blockId];
    if (!block) {
      return console.warn('no block registered for: %s', blockId);
    }

    // each block's promise is resolved when the block renders
    PROMISES[blockId] = Q.Promise((resolve, reject) => {
      block.on('render.promise', resolve);
      block.on('error.promise', reject);
    });

    return d3.select(this)
      .datum({
        source: this.getAttribute('data-source'),
        block: blockId,
      })
      .call(block);
  });

// nest the windows chart inside the OS chart once they're both rendered
whenRendered(['os', 'windows'], () => {
  d3.select('#chart_os')
    .call(nestCharts, 'Windows', d3.select('#chart_windows'));
});

// nest the IE chart inside the browsers chart once they're both rendered
whenRendered(['browsers', 'ie'], () => {
  d3.select('#chart_browsers')
    .call(nestCharts, 'Internet Explorer', d3.select('#chart_ie'));
});

// nest the international countries chart inside the "International"
// chart once they're both rendered
whenRendered(['countries', 'international_visits'], () => {
  d3.select('#chart_us')
    .call(nestCharts, 'International', d3.select('#chart_countries'));
});

whenRendered(['countries', 'us_and_territories'], () => {
  d3.select('#chart_us')
    .call(nestCharts, 'United States &amp; Territories', d3.select('#chart_us_and_territories'));
});
/*
   * A very primitive, aria-based tab system!
   */
d3.selectAll("*[role='tablist']")
  .each(function () {
    // grab all of the tabs and panels
    const tabs = d3.select(this).selectAll("*[role='tab'][href]")
      .datum(function () {
        const target = document.getElementById(this.href.split('#').pop());
        return {
          selected: this.getAttribute('aria-selected') === 'true',
          target,
          tab: this,
          dataType: this.getAttribute('data-type'),
        };
      });

    const panels = d3.select(this.parentNode)
      .selectAll("*[role='tabpanel']");

    function update() {
      let selected;
      tabs.attr('aria-selected', (tab) => {
        if (tab.selected) {
          selected = tab.target;
          document.getElementById('top_table_type').innerHTML = tab.dataType;
        }
        return tab.selected;
      });
      panels.attr('aria-hidden', function (panel) {
        panel.selected = selected === this;
        return !panel.selected;
      })
        .style('display', (d) => (d.selected ? null : 'none'));
    }

    // when a tab is clicked, update the panels
    tabs.on('click', function (d) {
      d3.event.preventDefault();
      tabs.each((tab) => { tab.selected = false; });
      d.selected = true;

      update();

      // track in google analytics
      ga('send', 'event', 'Site Navigation', this.href, this.text);
    });

    // update them to start
    update();
  });

consolePrint(window);

// Set the dropdown
const dropDown = document.getElementById('agency-selector');

// Start on change listener to load new page
d3.select(dropDown).on('change', function () {
  window.location = d3.select(this).property('value');
});

for (let j = 0; j < dropDown.options.length; j += 1) {
  if (dropDown.options[j].value === window.location.pathname) {
    dropDown.selectedIndex = j;
    break;
  }
}
