export default function barChart() {
  let bars = d => d;
  let value = d => d.value;
  let format = String;
  let label = d => d.key;
  let scale = null;


  function size(n) {
    return `${(n || 0).toFixed(1)}%`;
  }

  function chart(selection) {
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

    const setScale = scale
      ? scale.call(selection, bin.data().map(value))
      : null;
      // console.log("scale:", setScale ? setScale.domain() : "(none)");
    bin.select('.bar')
      .style('width', setScale
        ? d => size(setScale(value(d)))
        : d => size(value(d)));

    bin.select('.label').html(label);
    bin.select('.value').text((d, i) => format.call(this, value(d), d, i));

    return bin;
  }

  chart.bars = (x) => {
    if (!arguments.length) return bars;
    bars = d3.functor(x);
    return chart;
  };

  chart.label = (x) => {
    if (!arguments.length) return label;
    label = d3.functor(x);
    return chart;
  };

  chart.value = (x) => {
    if (!arguments.length) return value;
    value = d3.functor(x);
    return chart;
  };

  chart.format = (x) => {
    if (!arguments.length) return format;
    format = d3.functor(x);
    return chart;
  };

  chart.scale = (x) => {
    if (!arguments.length) return scale;
    scale = d3.functor(x);
    return chart;
  };

  return chart;
}
