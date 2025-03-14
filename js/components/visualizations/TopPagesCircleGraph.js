import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3-7";

import DataLoader from "../../lib/data_loader";
import FilterSelect from "../select/FilterSelect";

/**
 * Retrieves the top viewed pages report from the passed data URL and creates a
 * visualization for the top pages by hostname.
 *
 * @param {object} props the properties for the component
 * @param {*} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @returns {import('react').ReactElement} The rendered element
 */
function TopPagesCircleGraph({ dataHrefBase }) {
  const reportNameFilters = [
    ["Active Users", "top-pages-by-active-user"],
    ["Page Views", "top-viewed-pages"],
  ];
  const reportPeriodFilters = [
    ["Last 7 Days", "7-days"],
    ["Last 30 Days", "30-days"],
    ["Last 90 Days", "90-days"],
    ["Current Calendar Year", "current-year"],
    ["Current Fiscal Year", "current-fiscal-year"],
    ["Previous Calendar Year", "previous-year"],
    ["Previous Fiscal Year", "previous-fiscal-year"],
  ];
  const maxHostnameFilters = [
    ["10", "10"],
    ["20", "20"],
    ["30", "30"],
    ["40", "40"],
    ["50", "50"],
  ];
  const maxPageFilters = [
    ["25", "25"],
    ["50", "50"],
    ["75", "75"],
    ["100", "100"],
  ];
  const [currentReportNameFilter, setCurrentReportNameFilter] = useState(
    reportNameFilters[0],
  );
  const [currentReportPeriodFilter, setCurrentReportPeriodFilter] = useState(
    reportPeriodFilters[0],
  );
  const ref = useRef(null);
  const [maxHostnameFilter, setMaxHostnameFilter] = useState(
    maxHostnameFilters[2][1],
  );
  const [maxPageFilter, setMaxPageFilter] = useState(maxPageFilters[1][1]);
  const [shouldDisplayPages, setShouldDisplayPages] = useState(false);

  useEffect(() => {
    const initChart = async () => {
      await loadDataAndBuildChart();
    };
    initChart().catch(console.error);
  }, [
    currentReportNameFilter,
    currentReportPeriodFilter,
    dataHrefBase,
    maxHostnameFilter,
    maxPageFilter
  ]);

  async function loadDataAndBuildChart() {
    if (ref.current) {
      ref.current.innerHTML = "";
    }

    const report = await loadData();

    if (
      report &&
      report.data &&
      Array.isArray(report.data) &&
      report.data.length > 0
    ) {
      await drawChart(transformData(report.data));
      setShouldDisplayPages(true);
    } else {
      setShouldDisplayPages(false)
    }
  }

  async function loadData() {
    let report;

    try {
      report = await DataLoader.loadJSON(
        `${dataHrefBase}/${currentReportNameFilter[1]}-${currentReportPeriodFilter[1]}.json`,
      );
    } catch (e) {
      report = { data: [] };
    }

    return report;
  }

  function transformData(data) {
    const transformedData = {
      name: "flare",
    };
    const grouped = Object.groupBy(data, (item) => {
      return item.domain;
    });
    transformedData.children = Object.keys(grouped)
      .map((key) => {
        return {
          name: key,
          children: grouped[key]
            .slice(0, parseInt(maxPageFilter[1]))
            .map((item) => {
              return {
                name: item.pagePath,
                value: parseInt(
                  currentReportNameFilter[0] == "Page Views"
                    ? item.pageviews
                    : item.activeUsers,
                ),
              };
            }),
        };
      })
      .slice(0, parseInt(maxHostnameFilter[1]));

    return transformedData;
  }

  async function drawChart(transformedData) {
    // Specify the chart’s dimensions.  The numbers don't matter, it will scale
    // to the width of the container
    const width = 928;
    const height = width;

    // Create the color scale.
    // Play with range and domain to alter the circle colors.
    // Background color is defined with a class on the SVG below.
    const color = d3
      .scaleLinear()
      .domain([0, 3])
      // Palette colors to HSL.
      // 1 hsl(239, 94%, 19%)
      // 2 hsl(214, 97%, 27%)
      // 6 hsl(190, 74%, 59%)
      // 7 hsl(189, 75%, 75%)
      // 8 hsl(190, 76%, 82%)
      // 9 hsl(190, 77%, 88%)
      .range(["hsl(190, 77%, 88%)", "hsl(239, 94%, 19%)"])
      .interpolate(d3.interpolateHcl);

    const pack = (data) => {
      // Compute the layout.
      return d3.pack().size([width, height]).padding(3)(
        d3
          .hierarchy(data)
          .sum((d) => d.value)
          .sort((a, b) => b.value - a.value),
      );
    };
    const root = pack(transformedData);

    // Create the SVG container.
    const svg = d3
      .select(ref.current)
      .append("svg")
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .attr("width", width)
      .attr("height", height)
      .attr(
        "class",
        "height-auto maxw-full display-block bg-palette-color-8 cursor-pointer",
      );

    // Append the nodes.
    const node = svg
      .append("g")
      .selectAll("circle")
      .data(root.descendants().slice(1))
      .join("circle")
      .attr("fill", (d) => (d.children ? color(d.depth) : "white"))
      .attr("pointer-events", (d) => (!d.children ? "none" : null))
      .on("mouseover", function () {
        d3.select(this).attr("stroke", "#000");
      })
      .on("mouseout", function () {
        d3.select(this).attr("stroke", null);
      })
      .on(
        "click",
        (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()),
      );

    // Append the text labels.
    const label = svg
      .append("g")
      .style("font", "14px sans-serif")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
      .style("display", (d) => (d.parent === root ? "inline" : "none"))
      .text((d) => d.data.name);

    // Add DAP watermark SVG
    svg
      .append("image")
      .attr("xlink:href", "/images/dap-watermark.svg")
      .attr("width", 175)
      .attr("height", 175)
      .attr("x", "300")
      .attr("y", "300");

    // Create the zoom behavior and zoom immediately in to the initial focus node.
    svg.on("click", (event) => zoom(event, root));
    let focus = root;
    let view;
    zoomTo([focus.x, focus.y, focus.r * 2]);

    function zoomTo(v) {
      const k = width / v[2];

      view = v;

      label.attr(
        "transform",
        (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`,
      );
      node.attr(
        "transform",
        (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`,
      );
      node.attr("r", (d) => d.r * k);
    }

    function zoom(event, d) {
      focus = d;

      const transition = svg
        .transition()
        .duration(event.altKey ? 7500 : 750)
        .tween("zoom", () => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return (t) => zoomTo(i(t));
        });

      label
        .filter(function (d) {
          return d.parent === focus || this.style.display === "inline";
        })
        .transition(transition)
        .style("fill-opacity", (d) => (d.parent === focus ? 1 : 0))
        .on("start", function (d) {
          if (d.parent === focus) this.style.display = "inline";
        })
        .on("end", function (d) {
          if (d.parent !== focus) this.style.display = "none";
        });
    }
  }

  async function reportNameFilterChangeHandler(reportName) {
    if (!reportName) return;

    const selectedFilter = reportNameFilters.find((reportNameFilter) => {
      return reportNameFilter[1] == reportName;
    });
    await setCurrentReportNameFilter(selectedFilter);
  }

  async function reportPeriodFilterChangeHandler(reportPeriod) {
    if (!reportPeriod) return;

    const selectedFilter = reportPeriodFilters.find((reportPeriodFilter) => {
      return reportPeriodFilter[1] == reportPeriod;
    });
    await setCurrentReportPeriodFilter(selectedFilter);
  }

  async function maxHostnameFilterChangeHandler(hostnameCount) {
    if (!hostnameCount) return;

    const selectedFilter = maxHostnameFilters.find((maxHostnameFilter) => {
      return maxHostnameFilter[1] == hostnameCount;
    });
    await setMaxHostnameFilter(selectedFilter);
  }

  async function maxPageFilterChangeHandler(pageCount) {
    if (!pageCount) return;

    const selectedFilter = maxPageFilters.find((maxPageFilter) => {
      return maxPageFilter[1] == pageCount;
    });
    await setMaxPageFilter(selectedFilter);
  }

  function timeIntervalDescription() {
    return `over the ${currentReportPeriodFilter[0].toLowerCase()}`;
  }

  return (
    <>
      <div className="grid-row">
        <h2 className="grid-col-12 text-center">
          {`Top Hostnames and Page Paths by ${currentReportNameFilter[0]}`}
        </h2>
      </div>
      <div className="grid-col-12 text-center">
        {shouldDisplayPages && (
          <p className="margin-top-05 margin-bottom-105">
            <a
              href={`${dataHrefBase}/${currentReportNameFilter[1]}-${currentReportPeriodFilter[1]}.csv`}
              aria-label={`${currentReportNameFilter[1]}-${currentReportPeriodFilter[1]}.csv`}
            >
              Download the data
              <svg
                className="usa-icon margin-bottom-neg-05 margin-left-05"
                aria-hidden="true"
                focusable="false"
                role="img"
              >
                <use xlinkHref="/assets/uswds/img/sprite.svg#file_present"></use>
              </svg>
            </a>
          </p>
        )}
      </div>
      <div className="grid-row padding-bottom-2">
        <div className="desktop:grid-offset-3 desktop:grid-col-6 card:grid-col-12">
          <div className="grid-row">
            <div className="card:grid-col-6 desktop:grid-col-3">
              <h3 className="text-center">Metric</h3>
              <FilterSelect
                filters={reportNameFilters}
                defaultFilterValue={reportNameFilters[0][1] || ""}
                onChange={reportNameFilterChangeHandler}
                name={"top pages chart metric name filter"}
                className="margin-x-auto maxw-full text--overflow-ellipsis"
              />
            </div>
            <div className="card:grid-col-6 desktop:grid-col-3">
              <h3 className="text-center">Time Period</h3>
              <FilterSelect
                filters={reportPeriodFilters}
                defaultFilterValue={reportPeriodFilters[0][1] || ""}
                onChange={reportPeriodFilterChangeHandler}
                name={"top pages chart time period filter"}
                className="margin-x-auto maxw-full text--overflow-ellipsis"
              />
            </div>
            <div className="card:grid-col-6 desktop:grid-col-3">
              <h3 className="text-center">Max Hostnames</h3>
              <FilterSelect
                filters={maxHostnameFilters}
                defaultFilterValue={maxHostnameFilters[2][1] || ""}
                onChange={maxHostnameFilterChangeHandler}
                name={"top pages chart max hostname filter"}
                className="margin-x-auto maxw-full text--overflow-ellipsis"
              />
            </div>
            <div className="card:grid-col-6 desktop:grid-col-3">
              <h3 className="text-center">Max Pages</h3>
              <FilterSelect
                filters={maxPageFilters}
                defaultFilterValue={maxPageFilters[2][1] || ""}
                onChange={maxPageFilterChangeHandler}
                name={"top pages chart max page filter"}
                className="margin-x-auto maxw-full text--overflow-ellipsis"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="grid-row">
        {!shouldDisplayPages && (
          <p className="margin-top-2 margin-bottom-1 desktop:grid-offset-3 desktop:grid-col-6 card:grid-col-12 text-center text-bold">
            {`Top pages data ${timeIntervalDescription()} is unavailable.`}
          </p>
        )}
        {shouldDisplayPages && (
          <div className="desktop:grid-offset-3 desktop:grid-col-6 card:grid-col-12">
            <figure className="display-block margin-auto" ref={ref}></figure>
          </div>
        )}
      </div>
    </>
  );
}

TopPagesCircleGraph.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default TopPagesCircleGraph;
