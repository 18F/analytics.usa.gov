(function(exports) {

  // some constants
  var DATA_URL_FORMAT = "https://dap.18f.us/data/live/{source}.json";

  // common parsing and formatting functions
  var formatCommas = d3.format(","),
      parseDate = d3.time.format("%Y-%m-%d").parse,
      formatDate = d3.time.format("%A, %b %e"),
      formatVisits = (function() {
        var suffix = {
          "k": "k", // thousands
          "M": "m", // millions
          "G": "b"  // billions
        };
        return function(visits) {
          var prefix = d3.formatPrefix(visits);
          return prefix && suffix.hasOwnProperty(prefix.symbol)
            ? prefix.scale(visits).toFixed(1) + suffix[prefix.symbol]
            : formatCommas(visits);
        };
      })(),
      trimZeroes = function(str) {
        return str.replace(/0+$/, '');
      },
      formatPercent = function(p) {
        return p >= 1
          ? trimZeroes(p.toFixed(1)) + "%"
          : "< 1%";
      };

  /*
   * Define block renderers for each of the different data types.
   */
  var BLOCKS = {

    // the realtime block is just `data.totals.active_visitors` formatted with commas
    "realtime": renderBlock()
      .render(function(selection, data) {
        var totals = data.data[0];
        // console.log("realtime totals:", totals);
        selection.text(formatCommas(+totals.active_visitors));
      }),

    // the OS block is a stack layout
    "os": renderBlock()
      .transform(function(d) {
        var values = listify(d.totals.os),
            total = d3.sum(values.map(function(d) { return d.value; }));
        return addShares(collapseOther(values, total * .01));
      })
      .render(barChart()
        .value(function(d) { return d.share * 100; })
        .format(formatPercent)),

    // the windows block is a stack layout
    "windows": renderBlock()
      .transform(function(d) {
        return addShares(listify(d.totals.os_version));
      })
      .render(barChart()
        .value(function(d) { return d.share * 100; })
        .format(formatPercent)),

    // the devices block is a stack layout
    "devices": renderBlock()
      .transform(function(d) {
        var devices = listify(d.totals.devices);
        return addShares(devices);
      })
      .render(barChart()
        .value(function(d) { return d.share * 100; })
        .format(formatPercent)),

    // the browsers block is a table
    "browsers": renderBlock()
      .transform(function(d) {
        var values = listify(d.totals.browser),
            total = d3.sum(values.map(function(d) { return d.value; }));
        return addShares(collapseOther(values, total * .015));
      })
      .render(barChart()
        .value(function(d) { return d.share * 100; })
        .format(formatPercent)),

    // the IE block is a stack, but with some extra work done to transform the
    // data beforehand to match the expected object format
    "ie": renderBlock()
      .transform(function(d) {
        return addShares(listify(d.totals.ie_version));
      })
      .render(
        barChart()
          .value(function(d) { return d.share * 100; })
          .format(formatPercent)
       )
      .on("render", function(selection) {
        // we can add IE icons this way:
        /*
        selection.selectAll(".bar .label")
          .append("img")
            .attr("src", function(d) {
              // e.g. "ie-11.png"
              return "images/ie-" + Math.floor(+d.key) + ".png";
            });
        */
      }),

    // the top pages block(s)
    "top-pages": renderBlock()
      .transform(function(d) {
        return d.data;
      })
      .on("render", function(selection, data) {
        // turn the labels into links
        selection.selectAll(".label")
          .each(function(d) {
            d.text = this.innerText;
          })
          .html("")
          .append("a")
            .attr("href", function(d) {
              return "http://" + d.domain;
            })
            .text(function(d) {
              return d.text;
            });
      })
      .render(barChart()
        .label(function(d) { return d.domain; })
        .value(function(d) { return +d.visits; })
        .scale(function(values) {
          var max = d3.max(values);
          return d3.scale.linear()
            .domain([0, 1, d3.max(values)])
            .rangeRound([0, 1, 100]);
        })
        .format(formatVisits)),

    // the top pages block(s)
    "top-pages-realtime": renderBlock()
      .transform(function(d) {
        return d.data;
      })
      .on("render", function(selection, data) {
        // turn the labels into links
        selection.selectAll(".label")
          .each(function(d) {
            d.text = this.innerText;
          })
          .html("")
          .append("a")
            .attr("href", function(d) {
              return "http://" + d.page;
            })
            .text(function(d) {
              return d.text;
            });
      })
      .render(barChart()
        .label(function(d) { return d.page_title; })
        .value(function(d) { return +d.active_visitors; })
        .scale(function(values) {
          var max = d3.max(values);
          return d3.scale.linear()
            .domain([0, 1, d3.max(values)])
            .rangeRound([0, 1, 100]);
        })
        .format(formatVisits))

  };

  /*
   * Now, initialize all of the blocks by:
   *
   * 1. grabbing their data-block attribute
   * 2. looking up the block id in our `BLOCKS` object, and
   * 3. if a renderer exists, calling it on the selection
   */
  d3.selectAll("*[data-source]")
    .each(function() {
      var blockId = this.getAttribute("data-block"),
          block = BLOCKS[blockId];
      if (!block) {
        return console.warn("no block registered for: %s", blockId);
      }

      d3.select(this)
        .datum({
          source: this.getAttribute("data-source"),
          block: blockId
        })
        .call(block);
    });

  /*
   * A very primitive, aria-based tab system!
   */
  d3.selectAll("*[role='tablist']")
    .each(function() {
      // grab all of the tabs and panels
      var tabs = d3.select(this).selectAll("*[role='tab'][href]")
            .datum(function() {
              var href = this.href,
                  target = document.getElementById(href.split("#").pop());
              return {
                selected: this.getAttribute("aria-selected") === "true",
                target: target
              };
            }),
          panels = d3.select(this.parentNode)
            .selectAll("*[role='tabpanel']");

      // when a tab is clicked, update the panels
      tabs.on("click", function(d) {
        d3.event.preventDefault();
        tabs.each(function(tab) { tab.selected = false; });
        d.selected = true;
        update();
      });

      // update them to start
      update();

      function update() {
        var selected;
        tabs.attr("aria-selected", function(tab) {
          if (tab.selected) selected = tab.target;
          return tab.selected;
        });
        panels.attr("aria-hidden", function(panel) {
          panel.selected = selected === this;
          return !panel.selected;
        })
        .style("display", function(d) {
          return d.selected ? null : "none";
        });
      }
    });

  var updateTime = function() {
    var stamp = moment().format('MMMM Do YYYY, h:mma')
    d3.select("time#datetime")
      .text(stamp)
  };
  updateTime();
  setInterval(updateTime, 5 * 1000)

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
    var url = function(d) {
          return d && d.source;
        },
        transform = Object,
        renderer = function() { },
        dispatch = d3.dispatch("loading", "load", "error", "render");

    var block = function(selection) {
      selection
        .each(function(d) {
          if (d._request) d._request.abort();

          var that = d3.select(this)
            .classed("loading", true)
            .classed("loaded error", false);

          dispatch.loading(selection, d);

          var json = url.apply(this, arguments);
          if (!json) {
            return console.error("no data source found:", this, d);
          }

          d._request = d3.json(json, function(error, data) {
            that.classed("loading", false);
            if (error) return that.call(onerror, error);

            that.classed("loaded", true);
            dispatch.load(selection, data);
            that.call(render, d._data = transform(data));
          });
        });
    };

    function onerror(selection, request) {
      var message = request.responseText;

      selection.classed("error", true)
        .select(".error-message")
          .text(message);

      dispatch.error(selection, request, message);
    }

    block.render = function(x) {
      if (!arguments.length) return renderer;
      renderer = x;
      return block;
    };

    block.url = function(x) {
      if (!arguments.length) return url;
      url = d3.functor(x);
      return block;
    };

    block.transform = function(x) {
      if (!arguments.length) return transform;
      transform = d3.functor(x);
      return block;
    };

    function render(selection, data) {
      // populate meta elements
      selection.select(".meta-name")
        .text(function(d) { return d.meta.name; });
      selection.select(".meta-desc")
        .text(function(d) { return d.meta.description; });

      selection.select(".data")
        .datum(data)
        .call(renderer, data);
      dispatch.render(selection, data);
    }

    return d3.rebind(block, dispatch, "on");
  }

  /*
   * listify an Object into its key/value pairs (entries) and sorting by
   * numeric value descending.
   */
  function listify(obj) {
    return d3.entries(obj)
      .sort(function(a, b) {
        return d3.descending(+a.value, +b.value);
      });
  }

  function barChart() {
    var bars = function(d) {
          return d;
        },
        value = function(d) {
          return d.value;
        },
        format = String,
        label = function(d) {
          return d.key;
        },
        scale = null,
        size = function(n) {
          return (n || 0).toFixed(1) + "%";
        };

    var chart = function(selection) {
      var bin = selection.selectAll(".bin")
        .data(bars);

      bin.exit().remove();

      var enter = bin.enter().append("div")
        .attr("class", "bin");
      enter.append("div")
        .attr("class", "label");
      enter.append("div")
        .attr("class", "value");
      enter.append("div")
        .attr("class", "bar")
        .style("width", "0%");

      var _scale = scale
        ? scale.call(selection, bin.data().map(value))
        : null;
      // console.log("scale:", _scale ? _scale.domain() : "(none)");
      bin.select(".bar")
        .style("width", _scale
          ? function(d) {
            return size(_scale(value(d)));
          }
          : function(d) {
            return size(value(d));
          });

      bin.select(".label").text(label);
      bin.select(".value").text(function(d, i) {
        return format.call(this, value(d), d, i);
      });
    };

    chart.bars = function(x) {
      if (!arguments.length) return bars;
      bars = d3.functor(x);
      return chart;
    };

    chart.label = function(x) {
      if (!arguments.length) return label;
      label = d3.functor(x);
      return chart;
    };

    chart.value = function(x) {
      if (!arguments.length) return value;
      value = d3.functor(x);
      return chart;
    };

    chart.format = function(x) {
      if (!arguments.length) return format;
      format = d3.functor(x);
      return chart;
    };

    chart.scale = function(x) {
      if (!arguments.length) return scale;
      scale = d3.functor(x);
      return chart;
    };

    return chart;
  }

  function element(selection, selector) {
    var el = selection.select(selector);
    if (!el.empty()) return el;

    var bits = selector.split("."),
        name = bits[0],
        klass = bits.slice(1).join(" ");
    return selection.append(name)
      .attr("class", klass);
  }

  function addShares(list, value) {
    if (!value) value = function(d) { return d.value; };
    var total = d3.sum(list.map(value));
    list.forEach(function(d) {
      d.share = value(d) / total;
    });
    return list;
  }

  function collapseOther(list, threshold) {
    var other = {key: "Other", value: 0, children: []},
        last = list.length - 1;
    while (last > 0 && list[last].value < threshold) {
      other.value += list[last].value;
      other.children.push(list[last]);
      list.splice(last, 1);
      last--;
    }
    list.push(other);
    return list;
  }

})(this);
