import d3 from "d3";
import Config from "../config";
import formatters from "./formatters";

/**
 * @returns {*} a D3 block which charts data
 */
export default function barChart() {
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

  const chart = function (selection) {
    // Remove all existing entries for the chart.
    const bin = selection.selectAll(":scope > .bin").data(bars);
    bin.exit().remove();

    /**
     * Create the bar HTML structure for each data entry
     * <!-- The chart parent element -->
     * <>
     *   <!-- One of the following structures for each data item -->
     *   <div class="bin">
     *     <div class="label">foobar</div>
     *     <div class="value">123%</div>
     *     <div class="bar" width="123%"></div>
     *   </div>
     * </>
     */
    const enter = bin.enter().append("div").attr("class", "bin");
    enter.append("div").attr("class", "label");
    enter.append("div").attr("class", "value");
    enter.append("div").attr("class", "bar").style("width", "0%");

    const componentScale = scale
      ? scale.call(selection, bin.data().map(value))
      : null;
    bin
      .select(".bar")
      .transition()
      .duration(Config.barchartTransitionDurationMs)
      .style(
        "width",
        componentScale
          ? (d) => formatters.floatToPercent(componentScale(value(d)))
          : (d) => formatters.floatToPercent(value(d)),
      );

    bin.select(".label").html(label);
    bin.select(".value").text(function (d, i) {
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
