import d3 from "d3";
import barChart from "./barchart";
import formatters from "./formatters";
import transformers from "./transformers";

/**
 * Uses the builder pattern for creating charts with D3.
 */
class ChartBuilder {
  #element;
  #data;
  #transformer = (data) => {
    return data;
  };
  #renderer;

  /**
   * @param {object} element the HTML element where the chart should be built
   * @returns {ChartBuilder} the instance of the builder for method chaining
   */
  setElement(element) {
    this.#element = element;
    return this;
  }

  /**
   * @param {*} data the JSON data for the chart
   * @returns {ChartBuilder} the instance of the builder for method chaining
   */
  setData(data) {
    this.#data = data;
    return this;
  }

  /**
   * @param {Function} transformer a function to call on each data item
   * @returns {ChartBuilder} the instance of the builder for method chaining
   */
  setTransformer(transformer) {
    this.#transformer = transformer;
    return this;
  }

  /**
   * @param {Function} renderer a function to call on the D3 selection when
   * rendering
   * @returns {ChartBuilder} the instance of the builder for method chaining
   */
  setRenderer(renderer) {
    this.#renderer = renderer;
    return this;
  }

  /**
   * Build the chart using the values set on the builder.
   *
   * @returns {Promise} resolves when the chart is rendered
   */
  build() {
    const transformedData = this.#transformer(this.#data);
    return d3
      .select(this.#element)
      .datum({
        data: this.#data,
        transformedData,
        block: this.#element,
      })
      .call((selection) => {
        // populate meta elements
        selection.select(".meta-name").text((d) => d.meta.name);
        selection.select(".meta-desc").text((d) => d.meta.description);
        selection
          .select(".data")
          .datum(transformedData)
          .call(this.#renderer, transformedData);
      });
  }

  /**
   * Convenience method which builds a bar chart
   *
   * @param {object} element the HTML element where the chart should be built
   * @param {*} data the JSON data for the chart
   * @param {Function} transformMethod a method to execute on each data element
   * @returns {Promise} resolves when the chart renders
   */
  buildBarChart(element, data, transformMethod) {
    return this.setElement(element)
      .setData(data)
      .setTransformer(transformMethod)
      .setRenderer(
        barChart()
          .value((d) => d.proportion)
          .format(formatters.floatToPercent),
      )
      .build();
  }

  /**
   * Builds a bar chart for the key with values that are below a threshold
   * combined into an Other category
   *
   * @param {object} element the HTML element where the chart should be built
   * @param {*} data the JSON data for the chart
   * @param {string} desiredKey the key of the data to use for the chart
   * @returns {Promise} resolves when the chart renders
   */
  buildBarBasicChart(element, data, desiredKey) {
    const method = (d) => transformers.toTopPercents(d, desiredKey);
    return this.buildBarChart(element, data, method);
  }

  /**
   * Create a bar chart designating labels for each bar
   *
   * @param {object} element the HTML element where the chart should be built
   * @param {*} data the JSON data for the chart
   * @param {Function} transformMethod a function to call on each data item
   * @param {string} labelKey the key of the data to use for the label
   * @returns {Promise} resolves when the chart renders
   */
  buildBarChartWithLabel(element, data, transformMethod, labelKey) {
    return this.setElement(element)
      .setData(data)
      .setTransformer(transformMethod)
      .setRenderer(
        barChart()
          .value((d) => d.proportion)
          .format(formatters.floatToPercent)
          .label((d) => d[labelKey]),
      )
      .build();
  }

  /**
   * Builds a bar chart for the key with values that are below a threshold
   * omitted from the chart
   *
   * @param {object} element the HTML element where the chart should be built
   * @param {*} data the JSON data for the chart
   * @param {string} desiredKey the key of the data to use for the chart
   * @param {number} maxItems the max number of items to be displayed in the
   * data array. Optional argument.
   * @returns {Promise} resolves when the chart renders
   */
  buildCompactBarChart(element, data, desiredKey, maxItems) {
    const method = (d) =>
      transformers.toTopPercentsWithoutConsolidation(d, desiredKey, maxItems);
    return this.buildBarChart(element, data, method);
  }

  /**
   * Builds a bar chart for the key with values that are below a threshold
   * consolidated into an "Other" bar
   *
   * @param {object} element the HTML element where the chart should be built
   * @param {*} data the JSON data for the chart
   * @param {string} desiredKey the key of the data to use for the chart
   * @param {number} maxItems the max number of items in the data array after
   * consolidating
   * @returns {Promise} resolves when the chart renders
   */
  buildConsolidatedBarchart(element, data, desiredKey, maxItems) {
    const method = (d) =>
      transformers.toTopPercentsWithMaxItems(d, desiredKey, maxItems);
    return this.buildBarChart(element, data, method);
  }
}

export default ChartBuilder;
