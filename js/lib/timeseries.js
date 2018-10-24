const TRANSITION_DURATION = 500;

function element(selection, selector) {
  const el = selection.select(selector);
  if (!el.empty()) return el;
  const bits = selector.split('.');
  const name = bits[0];

  const klass = bits.slice(1).join(' ');
  return selection.append(name)
    .attr('class', klass);
}

export default function timeSeries() {
  let series = d => [d];
  let bars = d => d;
  const width = 700;
  const height = 150;
  const padding = 50;

  const margin = {
    top: 10,
    right: padding,
    bottom: 25,
    left: padding,
  };

  let x = (d, i) => i;
  let y = (d, i) => d;
  let label = (d, i) => i;
  let title = d => d;


  let xScale = d3.scale.ordinal();
  let yScale = d3.scale.linear();

  let yAxis = d3.svg.axis()
    .scale(yScale)
    .ticks(5);


  const innerTickSize = yAxis.innerTickSize();
  const duration = TRANSITION_DURATION;

  function timeSeries(svg) {
    const right = width - margin.right;
    const bottom = height - margin.bottom;

    yScale.range([bottom, margin.top]);
    xScale.rangeRoundBands([margin.left, right], 0, 0);

    svg.attr('viewBox', [0, 0, width, height].join(' '));

    element(svg, 'g.axis.y0')
      .attr('transform', `translate(${[margin.left, 0]})`)
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
      .datum((d) => {
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
  }

  timeSeries.series = (fs) => {
    if (!arguments.length) return series;
    series = d3.functor(fs);
    return timeSeries;
  };

  timeSeries.bars = (fb) => {
    if (!arguments.length) return bars;
    bars = d3.functor(fb);
    return timeSeries;
  };

  timeSeries.x = (fx) => {
    if (!arguments.length) return x;
    x = d3.functor(fx);
    return timeSeries;
  };

  timeSeries.y = (fy) => {
    if (!arguments.length) return y;
    y = d3.functor(fy);
    return timeSeries;
  };

  timeSeries.xScale = (xs) => {
    if (!arguments.length) return xScale;
    xScale = xs;
    return timeSeries;
  };

  timeSeries.yScale = (xs) => {
    if (!arguments.length) return yScale;
    yScale = xs;
    return timeSeries;
  };

  timeSeries.yAxis = (ya) => {
    if (!arguments.length) return yAxis;
    yAxis = ya;
    return timeSeries;
  };

  timeSeries.label = (fl) => {
    if (!arguments.length) return label;
    label = fl;
    return timeSeries;
  };

  timeSeries.title = (ft) => {
    if (!arguments.length) return title;
    title = ft;
    return timeSeries;
  };

  return timeSeries;
}
