import { exceptions, titleExceptions } from './lib/exceptions';
import barChart from './lib/barchart';
import * as timeSeries from './lib/timeseries';
import * as consolePrint from './lib/consoleprint';
import helpers from './lib/helpers';

/*
   * our block renderer is a d3 selection manipulator that does a bunch of
   * stuff:
   *
   * 1. it knows how to get the URL for a block by either looking at the
   *    `source` key of its bound data _or_ the node's data-source attribute.
   * 2. it can be configured to transform the loaded data using a function
   * 3. it has a configurable rendering function that gets called on the first
   *    child of matching the `.data` selector.
   * 4. it dispatches events "loading", "load", "render" and "error" events to
   *    notify us of the state of data.
   *
   * Example:
   *
   * ```js
   * var block = renderBlock()
   *   .render(function(selection, data) {
   *     selection.text(JSON.stringify(data));
   *   });
   * d3.select("#foo")
   *   .call(block);
   * ```
   */
function renderBlock() {
  function url(d) { return d && d.source; }
  function renderer() { }
  let transform = Object;

  const dispatch = d3.dispatch('loading', 'load', 'error', 'render');

  function onerror(selection, request) {
    const message = request.responseText;

    selection.classed('error', true)
      .select('.error-message')
      .text(message);

    dispatch.error(selection, request, message);
  }

  function render(selection, data) {
    // populate meta elements
    selection.select('.meta-name')
      .text(d => d.meta.name);
    selection.select('.meta-desc')
      .text(d => d.meta.description);

    selection.select('.data')
      .datum(data)
      .call(renderer, data);
    dispatch.render(selection, data);
  }

  function load(d) {
    if (d.dataRequest) d.dataRequest.abort();

    const that = d3.select(this)
      .classed('loading', true)
      .classed('loaded error', false);

    dispatch.loading(selection, d);

    const json = url.apply(this, arguments);
    if (!json) {
      return console.error('no data source found:', this, d);
    }

    d.dataRequest = d3.json(json, (error, data) => {
      that.classed('loading', false);
      if (error) return that.call(onerror, error);

      that.classed('loaded', true);
      dispatch.load(selection, data);
      that.call(render, d.transFormedData = transform(data));
    });
  }

  function block(selection) {
    selection
      .each(load)
      .filter((d) => {
        d.refresh = +this.getAttribute('data-refresh');
        return !Number.isNaN(d.refresh) && d.refresh > 0;
      })
      .each((d) => {
        const that = d3.select(this);
        d.interval = setInterval(() => {
          that.each(load);
        }, d.refresh * 1000);
      });
  }

  block.render = (x) => {
    if (!arguments.length) return renderer;
    renderer = x;
    return block;
  };

  block.url = (x) => {
    if (!arguments.length) return url;
    url = d3.functor(x);
    return block;
  };

  block.transform = (x) => {
    if (!arguments.length) return transform;
    transform = d3.functor(x);
    return block;
  };

  return d3.rebind(block, dispatch, 'on');
}

function addShares(list, value) {
  if (!value) value = d => d.value;
  const total = d3.sum(list.map(value));
  list.forEach((d) => {
    d.share = value(d) / total;
  });

  return list;
}

function collapseOther(list, threshold) {
  let otherPresent = false;
  const other = { key: 'Other', value: 0, children: [] };


  let last = list.length - 1;
  while (last > 0 && list[last].value < threshold) {
    other.value += list[last].value;
    other.children.push(list[last]);
    list.splice(last, 1);
    last -= 1;
  }
  for (let i = 0; i < list.length; i += 1) {
    if (list[i].key === 'Other') {
      otherPresent = true;
      list[i].value += other.value;
    }
  }
  if (!otherPresent) {
    list.push(other);
  }
  return list;
}

/*
   * Define block renderers for each of the different data types.
   */
const BLOCKS = {

  // the realtime block is just `data.totals.active_visitors` formatted with commas
  realtime: renderBlock()
    .render((selection, data) => {
      const totals = data.data[0];
      selection.text(helpers.formatCommas(+totals.active_visitors));
    }),

  today: renderBlock()
    .render((svg, data) => {
      const days = data.data;
      days.forEach((d) => {
        d.visits = +d.visits;
      });

      const y = d => d.visits;


      const series = timeSeries()
        .series([data.data])
        .y(y)
        .label(d => helpers.formatHour(d.hour))
        .title(d => `${helpers.formatCommas(d.visits)
        } visits during the hour of ${
          helpers.formatHour(d.hour)}m`);

      series.xScale()
        .domain(d3.range(0, days.length + 1));

      series.yScale()
        .domain([0, d3.max(days, y)]);

      series.yAxis()
        .tickFormat(helpers.formatVisits);

      svg.call(series);
    }),

  // the OS block is a stack layout
  os: renderBlock()
    .transform((d) => {
      const values = helpers.listify(d.totals.os);


      const total = d3.sum(values.map(d => d.value));
      return addShares(collapseOther(values, total * 0.01));
    })
    .render(barChart()
      .value(d => d.share * 100)
      .format(helpers.formatPercent)),

  // the windows block is a stack layout
  windows: renderBlock()
    .transform((d) => {
      const values = helpers.listify(d.totals.os_version);


      const total = d3.sum(values.map(d => d.value));
      return addShares(collapseOther(values, total * 0.001)); // % of Windows
    })
    .render(barChart()
      .value(d => d.share * 100)
      .format(helpers.formatPercent)),

  // the devices block is a stack layout
  devices: renderBlock()
    .transform((d) => {
      const devices = helpers.listify(d.totals.devices);
      return addShares(devices);
    })
    .render(barChart()
      .value(d => d.share * 100)
      .format(helpers.formatPercent))
    .on('render', (selection, data) => {
      /*
         * XXX this is an optimization. Rather than loading
         * users.json, we total up the device numbers to get the "big
         * number", saving us an extra XHR load.
         */
      const total = d3.sum(data.map(d => d.value));
      d3.select('#total_visitors')
        .text(helpers.formatBigNumber(total));
    }),

  // the browsers block is a table
  browsers: renderBlock()
    .transform((d) => {
      const values = helpers.listify(d.totals.browser);


      const total = d3.sum(values.map(d => d.value));
      return addShares(collapseOther(values, total * 0.01));
    })
    .render(barChart()
      .value(d => d.share * 100)
      .format(helpers.formatPercent)),

  // the IE block is a stack, but with some extra work done to transform the
  // data beforehand to match the expected object format
  ie: renderBlock()
    .transform((d) => {
      const values = helpers.listify(d.totals.ie_version);


      const total = d3.sum(values.map(d => d.value));
      return addShares(collapseOther(values, total * 0.0001)); // % of IE
    })
    .render(
      barChart()
        .value(d => d.share * 100)
        .format(helpers.formatPercent),
    ),

  cities: renderBlock()
    .transform((d) => {
      // remove "(not set) from the data"
      const cityList = d.data;
      let cityListFiltered = cityList.filter(c => (c.city !== '(not set)') && (c.city !== 'zz'));
      cityListFiltered = addShares(cityListFiltered, d => d.active_visitors);
      return cityListFiltered.slice(0, 10);
    })
    .render(
      barChart()
        .value(d => d.share * 100)
        .label(d => d.city)
        .format(helpers.formatPercent),
    ),

  countries: renderBlock()
    .transform((d) => {
      let totalVisits = 0;
      let USVisits = 0;
      d.data.forEach((c) => {
        totalVisits += parseInt(c.active_visitors, 10);
        if (c.country === 'United States') {
          USVisits = c.active_visitors;
        }
      });
      const international = totalVisits - USVisits;
      const data = {
        'United States': USVisits,
        'International &amp; Territories': international,
      };
      return addShares(helpers.listify(data));
    })
    .render(
      barChart()
        .value(d => d.share * 100)
        .format(helpers.formatPercent),
    ),
  internationalVisits: renderBlock()
    .transform((d) => {
      let countries = addShares(d.data, d => d.active_visitors);
      countries = countries.filter(c => c.country !== 'United States');
      return countries.slice(0, 15);
    })
    .render(
      barChart()
        .value(d => d.share * 100)
        .label(d => d.country)
        .format(helpers.formatPercent),
    ),

  'top-downloads': renderBlock()
    .transform(d => d.data.slice(0, 10))
    .render(
      barChart()
        .value(d => +d.total_events)
        .label(d => [
          '<span class="name"><a class="top-download-page" target="_blank" href=http://', d.page, '>', d.page_title, '</a></span> ',
          '<span class="domain" >', helpers.formatURL(d.page), '</span> ',
          '<span class="divider">/</span> ',
          '<span class="filename"><a class="top-download-file" target="_blank" href=', d.event_label, '>',
          helpers.helpersformatFile(d.event_label), '</a></span>',
        ].join(''))
        .scale(values => d3.scale.linear()
          .domain([0, 1, d3.max(values)])
          .rangeRound([0, 1, 100]))
        .format(helpers.formatCommas),
    ),

  // the top pages block(s)
  'top-pages': renderBlock()
    .transform(d => d.data)
    .on('render', (selection, data) => {
      // turn the labels into links
      selection.selectAll('.label')
        .each((d) => {
          d.text = this.innerText;
        })
        .html('')
        .append('a')
        .attr('target', '_blank')
        .attr('href', d => exceptions[d.domain] || (`http://${d.domain}`))
        .text(d => titleExceptions[d.domain] || d.domain);
    })
    .render(barChart()
      .label(d => d.domain)
      .value(d => +d.visits)
      .scale(values => d3.scale.linear()
        .domain([0, 1, d3.max(values)])
        .rangeRound([0, 1, 100]))
      .format(helpers.formatCommas)),

  // the top pages block(s)
  'top-pages-realtime': renderBlock()
    .transform(d => d.data)
    .on('render', (selection, data) => {
      // turn the labels into links
      selection.selectAll('.label')
        .each((d) => {
          d.text = this.innerText;
        })
        .html('')
        .append('a')
        .attr('target', '_blank')
        .attr('title', d => d.page_title)
        .attr('href', d => exceptions[d.page] || (`http://${d.page}`))
        .text(d => titleExceptions[d.page] || d.page_title);
    })
    .render(barChart()
      .label(d => d.page_title)
      .value(d => +d.active_visitors)
      .scale(values => d3.scale.linear()
        .domain([0, 1, d3.max(values)])
        .rangeRound([0, 1, 100]))
      .format(helpers.formatCommas)),

};

// store a promise for each block
const PROMISES = {};

/*
   * Now, initialize all of the blocks by:
   *
   * 1. grabbing their data-block attribute
   * 2. looking up the block id in our `BLOCKS` object, and
   * 3. if a renderer exists, calling it on the selection
   */
d3.selectAll('*[data-source]')
  .each(() => {
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

function whenRendered(blockIds, callback) {
  const promises = blockIds.map(id => PROMISES[id]);
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
function nestCharts(selection, parentFilter, child) {
  const parent = selection.selectAll('.bin')
    .filter(parentFilter);

  const scale = (child.attr('data-scale-to-parent') === 'true');

  const bins = child.selectAll('.bin')
    // If the child data should be scaled to be %'s of its parent bin,
    // then multiple each child item's % share by its parent's % share.
    .each((d) => {
      if (scale) d.share *= parent.datum().share;
    })
    .attr('data-share', d => d.share);

  // XXX we *could* call the renderer again here, but this works, so...
  bins.select('.bar')
    .style('width', d => `${(d.share * 100).toFixed(1)}%`);
  bins.select('.value')
    .text(d => helpers.formatPercent(d.share * 100));

  parent.node().appendChild(child.node());
}

// nest the windows chart inside the OS chart once they're both rendered
whenRendered(['os', 'windows'], () => {
  d3.select('#chart_os')
    .call(nestCharts, d => d.key === 'Windows', d3.select('#chart_windows'));
});

// nest the IE chart inside the browsers chart once they're both rendered
whenRendered(['browsers', 'ie'], () => {
  d3.select('#chart_browsers')
    .call(nestCharts, d => d.key === 'Internet Explorer', d3.select('#chart_ie'));
});

// nest the international countries chart inside the "International"
// chart once they're both rendered
whenRendered(['countries', 'internationalVisits'], () => {
  d3.select('#chart_us')
    .call(nestCharts, d => d.key === 'International &amp; Territories', d3.select('#chart_countries'));
});

/*
   * A very primitive, aria-based tab system!
   */
d3.selectAll("*[role='tablist']")
  .each(() => {
    // grab all of the tabs and panels
    const tabs = d3.select(this).selectAll("*[role='tab'][href]")
      .datum(() => {
        const target = document.getElementById(this.href.split('#').pop());
        return {
          selected: this.getAttribute('aria-selected') === 'true',
          target,
          tab: this,
        };
      });

    function update() {
      let selected;
      tabs.attr('aria-selected', (tab) => {
        if (tab.selected) selected = tab.target;
        return tab.selected;
      });
      const panels = d3.select(this.parentNode)
        .selectAll("*[role='tabpanel']");

      panels.attr('aria-hidden', (panel) => {
        panel.selected = selected === this;
        return !panel.selected;
      })
        .style('display', d => (d.selected ? null : 'none'));
    }

    // when a tab is clicked, update the panels
    tabs.on('click', (d) => {
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

// Set the dropdown
const dropDown = document.getElementById('agency-selector');

// Start on change listener to load new page
d3.select(dropDown).on('change', () => {
  window.location = d3.select(this).property('value');
});

for (let j = 0; j < dropDown.options.length; j += 1) {
  if (dropDown.options[j].value === window.location.pathname) {
    dropDown.selectedIndex = j;
    break;
  }
}

consolePrint(window);
