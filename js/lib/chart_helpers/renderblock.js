import d3 from "d3";
import barChart from "./barchart";
import formatters from "./formatters";
import transformers from "./transformers";

/**
 * Our block renderer is a d3 selection manipulator that does a bunch of
 * stuff:
 *
 * 1. it knows how to get the URL for a block by either looking at the
 * `source` key of its bound data _or_ the node's data-source attribute.
 * 2. it can be configured to transform the loaded data using a function
 * 3. it has a configurable rendering function that gets called on the first
 * child of matching the `.data` selector.
 * 4. it dispatches events "loading", "load", "render" and "error" events to
 * notify us of the state of data.
 *
 * Example:
 *
 * ```js
 * var block = loadAndRender()
 *   .render(function(selection, data) {
 *     selection.text(JSON.stringify(data));
 *   });
 * d3.select("#foo")
 *   .call(block);
 * ```
 *
 * @returns {*} a D3 block which loads data automatically
 */
function loadAndRender() {
  let url = function (d) {
    return d && d.source;
  };

  let transform = Object;

  let renderer = () => {
    return;
  };

  const dispatch = d3.dispatch("loading", "load", "error", "render");

  const block = function (selection) {
    selection
      .each(load)
      // TODO: Do the refresh by re-rendering components rather than having D3
      // do it here.  This breaks nested charts on refresh.
      .filter(function (d) {
        d.refresh = +this.getAttribute("data-refresh");
        return !Number.isNaN(d.refresh) && d.refresh > 0;
      })
      .each(function (d) {
        const that = d3.select(this);
        d.interval = setInterval(() => {
          that.each(load);
        }, d.refresh * 1000);
      });

    function load(d) {
      if (d.dataRequest) d.dataRequest.abort();

      const that = d3
        .select(this)
        .classed("loading", true)
        .classed("loaded error", false);

      dispatch.loading(selection, d);

      const json = url.apply(this, arguments);
      if (!json) {
        return console.error("no data source found:", this, d);
      }

      d.dataRequest = d3.json(json, (error, data) => {
        that.classed("loading", false);
        if (error) return that.call(onerror, error);

        that.classed("loaded", true);
        dispatch.load(selection, data);
        that.call(render, (d.transformedData = transform(data)));
      });
    }
  };

  function onerror(selection, request) {
    const message = request.responseText;

    selection.classed("error", true).select(".error-message").text(message);

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
    selection.select(".meta-name").text((d) => d.meta.name);
    selection.select(".meta-desc").text((d) => d.meta.description);

    selection.select(".data").datum(data).call(renderer, data);
    dispatch.render(selection, data);
  }

  return d3.rebind(block, dispatch, "on");
}

function buildBarChart(transformMethod) {
  return loadAndRender()
    .transform(transformMethod)
    .render(
      barChart()
        .value((d) => d.proportion)
        .format(formatters.floatToPercent),
    );
}

function buildBarChartWithLabel(transformMethod, labelKey) {
  return loadAndRender()
    .transform(transformMethod)
    .render(
      barChart()
        .value((d) => d.proportion)
        .format(formatters.floatToPercent)
        .label((d) => d[labelKey]),
    );
}

/**
 * Builds a bar chart for the key with values that are below a threshold
 * combined into an Other category
 *
 * @param {string} desiredKey the key of the data to use for the chart
 * @returns {Promise} resolves when the chart renders
 */
function buildBarBasicChart(desiredKey) {
  const method = (d) => transformers.toTopPercents(d, desiredKey);
  return buildBarChart(method);
}

/**
 * Builds a bar chart for the key with values that are below a threshold
 * omitted from the chart
 *
 * @param {string} desiredKey the key of the data to use for the chart
 * @returns {Promise} resolves when the chart renders
 */
function buildCompactBarChart(desiredKey) {
  const method = (d) =>
    transformers.toTopPercentsWithoutConsolidation(d, desiredKey);
  return buildBarChart(method);
}

export default {
  loadAndRender,
  buildBarChart,
  buildBarBasicChart,
  buildBarChartWithLabel,
  buildCompactBarChart,
};
