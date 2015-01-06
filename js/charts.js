(function(exports) {

  var sourceUrl = "https://dap.18f.us/bulk/{source}.json",
      formatCommas = d3.format(","),
      charts = [
        {
          title: "Devices",
          source: "devices",
          render: renderDevices
        },
        {
          title: "OS",
          source: "os",
          render: renderOS
        },
        {
          title: "Windows",
          source: "windows",
          render: renderWindows
        },
        {
          title: "Sources",
          source: "sources",
          render: renderSources
        },
        {
          title: "Top Pages (7 days)",
          source: "top-pages-7-days",
          render: renderTopPages
        },
        {
          title: "Top Pages (30 days)",
          source: "top-pages-30-days",
          render: renderTopPages
        },
        {
          title: "Top Pages (90 days)",
          source: "top-pages-90-days",
          render: renderTopPages
        }
      ];

  var root = d3.select("#charts"),
      chart = root.selectAll(".chart")
        .data(charts)
        .enter()
        .append("div")
          .attr("class", "chart")
          .attr("id", function(d) { return d.source; });

  chart.classed("loading", true)
    .each(function(d) {
      var url = sourceUrl.replace(/{(\w+)}/g, function(_, key) {
            return d[key];
          }),
          chart = d3.select(this)
            .classed("loading", true);
      d.request = d3.json(url, function(error, data) {
        chart.classed("loading", false);
        if (error) {
          chart.classed("error", true);
          d.error = error.responseText;
          chart.call(error);
        } else {
          chart.classed("loaded", true);
          d.data = data;
          chart.call(render, d, data);
        }
      });
    });

  function render(selection, chart, data) {
    selection.append("h2")
      .attr("class", "title")
      .text(function(d) { return d.title; });

    selection.append("p")
      .attr("class", "description")
      .text(function(d) {
        return d.data.meta.description;
      });

    if (typeof chart.render === "function") {
      selection.append("div")
        .attr("class", "data")
        .call(chart.render, data);
    }
  }

  function error(chart) {
    chart.text("error.");
  }

  function renderDevices(selection, data) {
    return selection.call(totalsRenderer("devices"), data);
  }

  function renderOS(selection, data) {
    return selection.call(totalsRenderer("os"), data);
  }

  function renderWindows(selection, data) {
    return selection.call(totalsRenderer("os_version"), data);
  }

  function renderSources(selection, data) {
    var _data = {
      totals: {
        sources: d3.nest()
          .key(function(d) { return d["undefined"]; }) // FIXME
          .rollup(function(d) {
            return +d[0].visits;
          })
          .map(data.data)
        }
    };

    var render = totalsRenderer("sources")
      .href(function(d) {
        return d.label.match(/\.[a-z]{2,3}$/)
          ? "http://" + d.label
          : null;
      });
    return selection.call(render, _data);
  }

  function totalsRenderer(key) {
    var href;

    var render = function(selection, data) {
      var graph = selection.append("div")
        .attr("class", "graph bars vertical");

      var rows = d3.entries(data.totals[key])
            .map(function(entry) {
              return {
                label: entry.key,
                visits: entry.value
              };
            })
            .sort(function(a, b) {
              return d3.descending(a.visits, b.visits);
            }),
          domain = d3.extent(rows, function(d) {
            return d.visits;
          }),
          scale = d3.scale.linear()
            .domain(domain)
            .range(["1%", "100%"]);

      var chart = barChart()
        .rows(rows)
        .value(function(d) { return d.visits; })
        .href(href)
        .scale(scale);

      graph.call(chart);
    };

    render.href = function(x) {
      if (!arguments.length) return href;
      href = d3.functor(x);
      return render;
    };

    return render;
  }

  function renderTopPages(selection, data) {
    var graph = selection.append("div")
      .attr("class", "graph bars vertical");

    var rows = data.data.map(function(d) {
          return {
            page: d["undefined"], // FIXME
            visits: +d.visits
          };
        }),
        domain = d3.extent(rows, function(d) {
          return d.visits;
        }),
        scale = d3.scale.linear()
          .domain(domain)
          .range(["1%", "100%"]);

    var chart = barChart()
      .rows(rows)
      .label(function(d) { return d.page; })
      .value(function(d) { return d.visits; })
      .href(function(d) { return "http://" + d.page; })
      .scale(scale);

    graph.call(chart);
  }

  function barChart() {
    var rows = function(d) { return d; },
        label = function(d) { return d.label; },
        value = function(d) { return d.value; },
        format = d3.format(","),
        scale = d3.scale.linear()
          .domain([0, 1])
          .range(["1%", "100%"]),
        href = d3.functor(null);

    var barChart = function(selection) {
      var row = selection.selectAll(".row")
        .data(rows);

      row.exit().remove();

      var enter = row.enter().append("div")
        .attr("class", "row");

      enter.append("div")
        .attr("class", "bar fill")
        .append("span")
          .attr("class", "value");

      enter.append("span")
        .attr("class", "label")
        .append("a");

      row.select(".bar")
        .style("width", function(d) {
          return scale(value(d));
        });

      row.select(".label")
        .select("a")
          .attr("href", href)
          .text(label);

      row.select(".value")
        .text(function(d) {
          return format(value(d));
        });
    };

    barChart.rows = function(x) {
      if (!arguments.length) return rows;
      rows = d3.functor(x);
      return barChart;
    };

    barChart.label = function(x) {
      if (!arguments.length) return label;
      label = d3.functor(x);
      return barChart;
    };

    barChart.format = function(x) {
      if (!arguments.length) return format;
      format = d3.functor(x);
      return barChart;
    };

    barChart.value = function(x) {
      if (!arguments.length) return value;
      value = d3.functor(x);
      return barChart;
    };

    barChart.scale = function(x) {
      if (!arguments.length) return scale;
      scale = x;
      return barChart;
    };

    barChart.href = function(x) {
      if (!arguments.length) return scale;
      href = d3.functor(x);
      return barChart;
    };

    return barChart;
  }

})(this);
