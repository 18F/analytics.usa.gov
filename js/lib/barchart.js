import d3 from 'd3';

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

    const componentScale = scale
      ? scale.call(selection, bin.data().map(value))
      : null;
    bin.select('.bar')
      .style('width', componentScale
        ? (d) => size(componentScale(value(d)))
        : (d) => size(value(d)));

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
