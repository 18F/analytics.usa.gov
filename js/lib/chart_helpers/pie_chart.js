import d3 from "d3";
import colorbrewer from "colorbrewer";
import formatters from "./formatters";

/**
 * @param root0
 * @param root0.ref
 * @param root0.data
 * @param root0.width
 */
function renderPieChart({ ref, data, width, colorSet }) {
  // Setup pie chart data
  const dataWithPieLabels = data
    .filter((item) => {
      return item.proportion > 0.1;
    })
    .map((item) => {
      item.key = `${item.key} ( ${formatters.floatToPercent(item.proportion)} )`;
      return item;
    });
  const pie = d3.layout.pie().value((d) => {
    return d.value;
  });
  const pieData = [pie(dataWithPieLabels)];

  // Set pie chart dimensions
  const chartDimensions = {
    width,
    height: width * 0.65,
    innerRadius: 0,
    outerRadius: width / 4,
    labelRadius: width / 3.25,
  };

  // Setup pie chart colors
  const color = d3.scale.ordinal().range(colorSet);

  // Create pie chart
  return d3.select(ref).call((selection) => {
    /**
     * Create the svg structure for the pie chart
     *
     * <div class="pie-chart-container">
     *   <svg class="pie-chart">
     *     <g class="chart">
     *       <g class="slices" />
     *       <g class="labels" />
     *     </g>
     *   </svg>
     * </div>
     */
    const containerQuery = selection
      .selectAll(":scope > .pie-chart-container")
      .data(pieData);
    containerQuery.exit().remove();
    const container = containerQuery
      .enter()
      .append("div")
      .attr("class", "pie-chart-container");
    container.append("svg").attr({
      class: "pie-chart",
      height: chartDimensions.height,
      width: chartDimensions.width,
      viewBox: `0 0 ${chartDimensions.height} ${chartDimensions.width}`,
      preserveAspectRatio: "xMidYMid meet",
    });
    const svg = container.select("svg.pie-chart");
    svg.append("g").attr({
      class: "chart",
      transform: `translate(${chartDimensions.height / 2}, ${chartDimensions.width / 2})`,
    });
    const chart = svg.select("g.chart");
    chart.append("g").attr("class", "slices");
    const slices = chart.select("g.slices");
    chart.append("g").attr("class", "labels");
    const labels = chart.select("g.labels");

    // Apply dimensions to the chart components
    //chart.attr('transform', 'translate(-50%, -50%)');

    // Create the pie chart slices
    const pieArc = d3.svg
      .arc()
      .innerRadius(chartDimensions.innerRadius)
      .outerRadius(chartDimensions.outerRadius);
    const enteringArcs = slices.selectAll(".slice").data(pieData[0]).enter();

    enteringArcs
      .append("path")
      .attr("class", "slice")
      .attr("d", pieArc)
      .style("fill", function (d, i) {
        return color(i);
      });

    // Create the pie chart labels and connecting lines
    const enteringLabels = labels.selectAll(".label").data(pieData[0]).enter();
    const labelGroups = enteringLabels.append("g").attr("class", "label");
    const lines = labelGroups.append("line").attr({
      x1: function (d, i) {
        return pieArc.centroid(d)[0];
      },
      y1: function (d) {
        return pieArc.centroid(d)[1];
      },
      x2: function (d) {
        const centroid = pieArc.centroid(d);
        const midAngle = Math.atan2(centroid[1], centroid[0]);
        return Math.cos(midAngle) * chartDimensions.labelRadius;
      },
      y2: function (d) {
        const centroid = pieArc.centroid(d);
        const midAngle = Math.atan2(centroid[1], centroid[0]);
        return Math.sin(midAngle) * chartDimensions.labelRadius;
      },
      class: "label-line",
      stroke: function (d, i) {
        return color(i);
      },
    });
    const textLabels = labelGroups
      .append("text")
      .attr({
        x: function (d, i) {
          const centroid = pieArc.centroid(d),
            midAngle = Math.atan2(centroid[1], centroid[0]),
            x = Math.cos(midAngle) * chartDimensions.labelRadius,
            sign = x > 0 ? 1 : -1;
          return x + 5 * sign;
        },
        y: function (d, i) {
          const centroid = pieArc.centroid(d),
            midAngle = Math.atan2(centroid[1], centroid[0]),
            y = Math.sin(midAngle) * chartDimensions.labelRadius;
          return y;
        },
        "text-anchor": function (d, i) {
          const centroid = pieArc.centroid(d),
            midAngle = Math.atan2(centroid[1], centroid[0]),
            x = Math.cos(midAngle) * chartDimensions.labelRadius;
          return x > 0 ? "start" : "end";
        },
        class: "label-text",
        "alignment-baseline": "middle",
      })
      .text(function (d) {
        return d.data.key;
      });

    // relax the label!
    const alpha = 0.5,
      spacing = 30;

    function relax() {
      let again = false;
      textLabels.each(function (d, i) {
        const a = this,
          da = d3.select(a),
          y1 = da.attr("y");
        textLabels.each(function (d, j) {
          const b = this;
          if (a === b) {
            return;
          }

          const db = d3.select(b);
          if (da.attr("text-anchor") !== db.attr("text-anchor")) {
            return;
          }

          const y2 = db.attr("y");
          const deltaY = y1 - y2;

          if (Math.abs(deltaY) > spacing) {
            return;
          }

          again = true;
          const sign = deltaY > 0 ? 1 : -1;
          const adjust = sign * alpha;
          da.attr("y", +y1 + adjust);
          db.attr("y", +y2 - adjust);
        });
      });

      if (again) {
        const labelElements = textLabels[0];
        lines.attr("y2", function (d, i) {
          const labelForLine = d3.select(labelElements[i]);
          return labelForLine.attr("y");
        });
        setTimeout(relax, 20);
      }
    }

    relax();
  });
}

export default renderPieChart;
