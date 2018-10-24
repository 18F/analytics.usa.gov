import { exceptions, titleExceptions } from './lib/exceptions';

// common parsing and formatting functions
const formatCommas = d3.format(',');

function formatPrefix(suffixes) {
  if (!suffixes) return formatCommas;
  return (visits) => {
    const prefix = d3.formatPrefix(visits);

    const suffix = suffixes[prefix.symbol];
    return prefix && suffix
      ? prefix.scale(visits)
        .toFixed(suffix[1])
        .replace(/\.0+$/, '') + suffix[0]
      : formatCommas(visits);
  };
}


const formatVisits = formatPrefix({
  k: ['k', 1], // thousands
  M: ['m', 1], // millions
  G: ['b', 2], // billions
});


const formatBigNumber = formatPrefix({
  M: [' million', 1], // millions
  G: [' billion', 2], // billions
});


function trimZeroes(str) {
  return str.replace(/\.0+$/, '');
}

function formatPercent(p) {
  return p >= 0.1
    ? `${trimZeroes(p.toFixed(1))}%`
    : '< 0.1%';
};


function formatHour(hour) {
  const n = +hour;


  const suffix = n >= 12 ? 'p' : 'a';
  return (n % 12 || 12) + suffix;
};


function formatURL(url) {
  let index = 0;
  // find & remove protocol (http, ftp, etc.) and get domain
  if (url.indexOf('://') > -1) {
    index = 2;
  }
  // find & remove port number
  return url
    .split('/')[index]
    .split(':')[0]
    .replace(new RegExp('%20', 'g'), ' ');
}

function formatFile(url) {
  const splitUrls = url.split('/');
  const domain = splitUrls[splitUrls.length - 1];
  return domain.replace(new RegExp('%20', 'g'), ' ');
}

const TRANSITION_DURATION = 500;

/*
   * Define block renderers for each of the different data types.
   */
const BLOCKS = {

  // the realtime block is just `data.totals.active_visitors` formatted with commas
  realtime: renderBlock()
    .render((selection, data) => {
      const totals = data.data[0];
      selection.text(formatCommas(+totals.active_visitors));
    }),

  today: renderBlock()
    .transform(data => data)
    .render((svg, data) => {
      const days = data.data;
      days.forEach((d) => {
        d.visits = +d.visits;
      });

      const y = function (d) { return d.visits; };


      const series = timeSeries()
        .series([data.data])
        .y(y)
        .label(d => formatHour(d.hour))
        .title(d => `${formatCommas(d.visits)
        } visits during the hour of ${
          formatHour(d.hour)}m`);

      series.xScale()
        .domain(d3.range(0, days.length + 1));

      series.yScale()
        .domain([0, d3.max(days, y)]);

      series.yAxis()
        .tickFormat(formatVisits);

      svg.call(series);
    }),

  // the OS block is a stack layout
  os: renderBlock()
    .transform((d) => {
      const values = listify(d.totals.os);


      const total = d3.sum(values.map(d => d.value));
      return addShares(collapseOther(values, total * 0.01));
    })
    .render(barChart()
      .value(d => d.share * 100)
      .format(formatPercent)),

  // the windows block is a stack layout
  windows: renderBlock()
    .transform((d) => {
      const values = listify(d.totals.os_version);


      const total = d3.sum(values.map(d => d.value));
      return addShares(collapseOther(values, total * 0.001)); // % of Windows
    })
    .render(barChart()
      .value(d => d.share * 100)
      .format(formatPercent)),

  // the devices block is a stack layout
  devices: renderBlock()
    .transform((d) => {
      const devices = listify(d.totals.devices);
      return addShares(devices);
    })
    .render(barChart()
      .value(d => d.share * 100)
      .format(formatPercent))
    .on('render', (selection, data) => {
      /*
         * XXX this is an optimization. Rather than loading
         * users.json, we total up the device numbers to get the "big
         * number", saving us an extra XHR load.
         */
      const total = d3.sum(data.map(d => d.value));
      d3.select('#total_visitors')
        .text(formatBigNumber(total));
    }),

  // the browsers block is a table
  browsers: renderBlock()
    .transform((d) => {
      const values = listify(d.totals.browser);


      const total = d3.sum(values.map(d => d.value));
      return addShares(collapseOther(values, total * 0.01));
    })
    .render(barChart()
      .value(d => d.share * 100)
      .format(formatPercent)),

  // the IE block is a stack, but with some extra work done to transform the
  // data beforehand to match the expected object format
  ie: renderBlock()
    .transform((d) => {
      const values = listify(d.totals.ie_version);


      const total = d3.sum(values.map(d => d.value));
      return addShares(collapseOther(values, total * 0.0001)); // % of IE
    })
    .render(
      barChart()
        .value(d => d.share * 100)
        .format(formatPercent),
    ),

  cities: renderBlock()
    .transform((d) => {
      // remove "(not set) from the data"
      const city_list = d.data;
      let city_list_filtered = city_list.filter(c => (c.city != '(not set)') && (c.city != 'zz'));
      city_list_filtered = addShares(city_list_filtered, d => d.active_visitors);
      return city_list_filtered.slice(0, 10);
    })
    .render(
      barChart()
        .value(d => d.share * 100)
        .label(d => d.city)
        .format(formatPercent),
    ),

  countries: renderBlock()
    .transform((d) => {
      let total_visits = 0;
      let us_visits = 0;
      d.data.forEach((c) => {
        total_visits += parseInt(c.active_visitors);
        if (c.country === 'United States') {
          us_visits = c.active_visitors;
        }
      });
      const international = total_visits - us_visits;
      const data = {
        'United States': us_visits,
        'International &amp; Territories': international,
      };
      return addShares(listify(data));
    })
    .render(
      barChart()
        .value(d => d.share * 100)
        .format(formatPercent),
    ),
  international_visits: renderBlock()
    .transform((d) => {
      let countries = addShares(d.data, d => d.active_visitors);
      countries = countries.filter(c => c.country != 'United States');
      return countries.slice(0, 15);
    })
    .render(
      barChart()
        .value(d => d.share * 100)
        .label(d => d.country)
        .format(formatPercent),
    ),

  'top-downloads': renderBlock()
    .transform(d => d.data.slice(0, 10))
    .render(
      barChart()
        .value(d => +d.total_events)
        .label(d => [
          '<span class="name"><a class="top-download-page" target="_blank" href=http://', d.page, '>', d.page_title, '</a></span> ',
          '<span class="domain" >', formatURL(d.page), '</span> ',
          '<span class="divider">/</span> ',
          '<span class="filename"><a class="top-download-file" target="_blank" href=', d.event_label, '>',
          formatFile(d.event_label), '</a></span>',
        ].join(''))
        .scale((values) => {
          const max = d3.max(values);
          return d3.scale.linear()
            .domain([0, 1, d3.max(values)])
            .rangeRound([0, 1, 100]);
        })
        .format(formatCommas),
    ),

  // the top pages block(s)
  'top-pages': renderBlock()
    .transform(d => d.data)
    .on('render', (selection, data) => {
      // turn the labels into links
      selection.selectAll('.label')
        .each(function (d) {
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
      .scale((values) => {
        const max = d3.max(values);
        return d3.scale.linear()
          .domain([0, 1, d3.max(values)])
          .rangeRound([0, 1, 100]);
      })
      .format(formatCommas)),

  // the top pages block(s)
  'top-pages-realtime': renderBlock()
    .transform(d => d.data)
    .on('render', (selection, data) => {
      // turn the labels into links
      selection.selectAll('.label')
        .each(function (d) {
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
      .scale((values) => {
        const max = d3.max(values);
        return d3.scale.linear()
          .domain([0, 1, d3.max(values)])
          .rangeRound([0, 1, 100]);
      })
      .format(formatCommas)),

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

    d3.select(this)
      .datum({
        source: this.getAttribute('data-source'),
        block: blockId,
      })
      .call(block);
  });

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

// nest the international countries chart inside the "International" chart once they're both rendered
whenRendered(['countries', 'international_visits'], () => {
  d3.select('#chart_us')
    .call(nestCharts, d => d.key === 'International &amp; Territories', d3.select('#chart_countries'));
});

/*
   * A very primitive, aria-based tab system!
   */
d3.selectAll("*[role='tablist']")
  .each(function () {
    // grab all of the tabs and panels
    const tabs = d3.select(this).selectAll("*[role='tab'][href]")
      .datum(function () {
        const href = this.href;


        const target = document.getElementById(href.split('#').pop());
        return {
          selected: this.getAttribute('aria-selected') === 'true',
          target,
          tab: this,
        };
      });


    const panels = d3.select(this.parentNode)
      .selectAll("*[role='tabpanel']");

    // when a tab is clicked, update the panels
    tabs.on('click', function (d) {
      d3.event.preventDefault();
      tabs.each((tab) => { tab.selected = false; });
      d.selected = true;

      update();

      // track in google analytics
      const link = this.href;
      const text = this.text;
      ga('send', 'event', 'Site Navigation', link, text);
    });

    // update them to start
    update();

    function update() {
      let selected;
      tabs.attr('aria-selected', (tab) => {
        if (tab.selected) selected = tab.target;
        return tab.selected;
      });
      panels.attr('aria-hidden', function (panel) {
        panel.selected = selected === this;
        return !panel.selected;
      })
        .style('display', d => (d.selected ? null : 'none'));
    }
  });

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
  let url = function (d) {
    return d && d.source;
  };


  let transform = Object;


  let renderer = function () { };


  const dispatch = d3.dispatch('loading', 'load', 'error', 'render');

  const block = function (selection) {
    selection
      .each(load)
      .filter(function (d) {
        d.refresh = +this.getAttribute('data-refresh');
        return !isNaN(d.refresh) && d.refresh > 0;
      })
      .each(function (d) {
        const that = d3.select(this);
        d.interval = setInterval(() => {
          that.each(load);
        }, d.refresh * 1000);
      });

    function load(d) {
      if (d._request) d._request.abort();

      const that = d3.select(this)
        .classed('loading', true)
        .classed('loaded error', false);

      dispatch.loading(selection, d);

      const json = url.apply(this, arguments);
      if (!json) {
        return console.error('no data source found:', this, d);
      }

      d._request = d3.json(json, (error, data) => {
        that.classed('loading', false);
        if (error) return that.call(onerror, error);

        that.classed('loaded', true);
        dispatch.load(selection, data);
        that.call(render, d._data = transform(data));
      });
    }
  };

  function onerror(selection, request) {
    const message = request.responseText;

    selection.classed('error', true)
      .select('.error-message')
      .text(message);

    dispatch.error(selection, request, message);
  }

  block.render = function (x) {
    if (!arguments.length) return renderer;
    renderer = x;
    return block;
  };

  block.url = function (x) {
    if (!arguments.length) return url;
    url = d3.functor(x);
    return block;
  };

  block.transform = function (x) {
    if (!arguments.length) return transform;
    transform = d3.functor(x);
    return block;
  };

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

  return d3.rebind(block, dispatch, 'on');
}

/*
   * listify an Object into its key/value pairs (entries) and sorting by
   * numeric value descending.
   */
function listify(obj) {
  return d3.entries(obj)
    .sort((a, b) => d3.descending(+a.value, +b.value));
}

function barChart() {
  let bars = function (d) {
    return d;
  };


  let value = function (d) {
    return d.value;
  };


  let format = String;


  let label = function (d) {
    return d.key;
  };


  let scale = null;


  const size = function (n) {
    return `${(n || 0).toFixed(1)}%`;
  };

  const chart = function (selection) {
    const bin = selection.selectAll('.bin')
      .data(bars);

    bin.exit().remove();

    const enter = bin.enter().append('div')
      .attr('class', 'bin');
    enter.append('div')
      .attr('class', 'label');
    enter.append('div')
      .attr('class', 'value');
    enter.append('div')
      .attr('class', 'bar')
      .style('width', '0%');

    const _scale = scale
      ? scale.call(selection, bin.data().map(value))
      : null;
      // console.log("scale:", _scale ? _scale.domain() : "(none)");
    bin.select('.bar')
      .style('width', _scale
        ? d => size(_scale(value(d)))
        : d => size(value(d)));

    bin.select('.label').html(label);
    bin.select('.value').text(function (d, i) {
      return format.call(this, value(d), d, i);
    });
  };

  chart.bars = function (x) {
    if (!arguments.length) return bars;
    bars = d3.functor(x);
    return chart;
  };

  chart.label = function (x) {
    if (!arguments.length) return label;
    label = d3.functor(x);
    return chart;
  };

  chart.value = function (x) {
    if (!arguments.length) return value;
    value = d3.functor(x);
    return chart;
  };

  chart.format = function (x) {
    if (!arguments.length) return format;
    format = d3.functor(x);
    return chart;
  };

  chart.scale = function (x) {
    if (!arguments.length) return scale;
    scale = d3.functor(x);
    return chart;
  };

  return chart;
}

function timeSeries() {
  let series = function (d) { return [d]; };


  let bars = function (d) { return d; };


  const width = 700;


  const height = 150;


  const padding = 50;


  const margin = {
    top: 10,
    right: padding,
    bottom: 25,
    left: padding,
  };


  let x = function (d, i) { return i; };


  let y = function (d, i) { return d; };


  let label = function (d, i) { return i; };


  let title = function (d) { return d; };


  let xScale = d3.scale.ordinal();


  let yScale = d3.scale.linear();


  let yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(5);


  const innerTickSize = yAxis.innerTickSize();


  let xAxis;


  const duration = TRANSITION_DURATION;

  const timeSeries = function (svg) {
    const left = margin.left;


    const right = width - margin.right;


    const top = margin.top;


    const bottom = height - margin.bottom;

    yScale.range([bottom, top]);
    xScale.rangeRoundBands([left, right], 0, 0);

    svg.attr('viewBox', [0, 0, width, height].join(' '));

    element(svg, 'g.axis.y0')
      .attr('transform', `translate(${[left, 0]})`)
      .attr('aria-hidden', 'true')
      .transition()
      .duration(duration)
      .call(yAxis
        // .innerTickSize(left - right)
        .orient('left'));

    element(svg, 'g.axis.y1')
      .attr('transform', `translate(${[right, 0]})`)
      .attr('aria-hidden', 'true')
      .transition()
      .duration(duration)
      .call(yAxis
        .innerTickSize(innerTickSize)
        .orient('right'));

    const g = svg.selectAll('.series')
      .data(series);
    g.exit().remove();
    g.enter().append('g')
      .attr('class', 'series');

    const barWidth = xScale.rangeBand();

    const bar = g.selectAll('.bar')
      .data(bars);
    bar.exit().remove();
    const enter = bar.enter().append('g')
      .attr('class', 'bar')
      .attr('tabindex', 0);
    enter.append('rect')
      .attr('width', barWidth)
      .attr('y', 0)
      .attr('height', 0);
    enter.append('text')
      .attr('class', 'label');
    enter.append('title');

    bar
      .datum(function (d) {
        d = d || {};
        d.x = xScale(d.u = x.apply(this, arguments));
        d.y0 = yScale(d.v = y.apply(this, arguments));
        d.y1 = bottom;
        d.height = d.y1 - d.y0;
        return d;
      })
      .attr('aria-label', title)
      .attr('transform', d => `translate(${[d.x, d.y1]})`);

    bar.select('rect')
      .attr('width', barWidth)
      .transition()
      .duration(duration)
      .attr('y', d => -d.height)
      .attr('height', d => d.height);

    bar.select('.label')
      .attr('text-anchor', 'middle')
    // .attr("alignment-baseline", "before-edge")
      .attr('dy', 10)
      .attr('dx', barWidth / 2)
      .text(label);

    bar.select('title')
      .text(title);
  };

  timeSeries.series = function (fs) {
    if (!arguments.length) return series;
    series = d3.functor(fs);
    return timeSeries;
  };

  timeSeries.bars = function (fb) {
    if (!arguments.length) return bars;
    bars = d3.functor(fb);
    return timeSeries;
  };

  timeSeries.x = function (fx) {
    if (!arguments.length) return x;
    x = d3.functor(fx);
    return timeSeries;
  };

  timeSeries.y = function (fy) {
    if (!arguments.length) return y;
    y = d3.functor(fy);
    return timeSeries;
  };

  timeSeries.xScale = function (xs) {
    if (!arguments.length) return xScale;
    xScale = xs;
    return timeSeries;
  };

  timeSeries.yScale = function (xs) {
    if (!arguments.length) return yScale;
    yScale = xs;
    return timeSeries;
  };

  timeSeries.yAxis = function (ya) {
    if (!arguments.length) return yAxis;
    yAxis = ya;
    return timeSeries;
  };

  timeSeries.label = function (fl) {
    if (!arguments.length) return label;
    label = fl;
    return timeSeries;
  };

  timeSeries.title = function (ft) {
    if (!arguments.length) return title;
    title = ft;
    return timeSeries;
  };

  return timeSeries;
}

function element(selection, selector) {
  const el = selection.select(selector);
  if (!el.empty()) return el;

  const bits = selector.split('.');


  const name = bits[0];


  const klass = bits.slice(1).join(' ');
  return selection.append(name)
    .attr('class', klass);
}

function addShares(list, value) {
  if (!value) value = function (d) { return d.value; };
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
    last--;
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].key == 'Other') {
      otherPresent = true;
      list[i].value += other.value;
    }
  }
  if (!otherPresent) {
    list.push(other);
  }
  return list;
}

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


  const scale = (child.attr('data-scale-to-parent') == 'true');


  const share = parent.datum().share;


  const bins = child.selectAll('.bin')
  // If the child data should be scaled to be %'s of its parent bin,
  // then multiple each child item's % share by its parent's % share.
    .each((d) => {
      if (scale) d.share *= share;
    })
    .attr('data-share', d => d.share);

  // XXX we *could* call the renderer again here, but this works, so...
  bins.select('.bar')
    .style('width', d => `${(d.share * 100).toFixed(1)}%`);
  bins.select('.value')
    .text(d => formatPercent(d.share * 100));

  parent.node().appendChild(child.node());
}

// friendly console message

// plain text for IE
if (window._ie) {
  console.log("Hi! Please poke around to your heart's content.");
  console.log('');
  console.log('If you find a bug or something, please report it at https://github.com/GSA/analytics.usa.gov/issues');
  console.log('Like it, but want a different front-end? The data reporting is its own tool: https://github.com/18f/analytics-reporter');
  console.log('This is an open source, public domain project, and your contributions are very welcome.');
}

// otherwise, let's get fancy
else {
  const styles = {
    big: 'font-size: 24pt; font-weight: bold;',
    medium: 'font-size: 10pt',
    medium_bold: 'font-size: 10pt; font-weight: bold',
    medium_link: 'font-size: 10pt; font-weight: bold; color: #18f',
  };
  console.log("%cHi! Please poke around to your heart's content.", styles.big);
  console.log(' ');
  console.log('%cIf you find a bug or something, please report it over at %chttps://github.com/GSA/analytics.usa.gov/issues', styles.medium, styles.medium_link);
  console.log('%cLike it, but want a different front-end? The data reporting is its own tool: %chttps://github.com/18f/analytics-reporter', styles.medium, styles.medium_link);
  console.log('%cThis is an open source, public domain project, and your contributions are very welcome.', styles.medium);
}

// Set the dropdown
const dropDown = document.getElementById('agency-selector');

// Start on change listener to load new page
d3.select(dropDown).on('change', function () {
  window.location = d3.select(this).property('value');
});

for (let j = 0; j < dropDown.options.length; j++) {
  if (dropDown.options[j].value === window.location.pathname) {
    dropDown.selectedIndex = j;
    break;
  }
}
