import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import ChartBuilder from "../../lib/chart_helpers/chart_builder";
import DataLoader from "../../lib/data_loader";
import barChart from "../../lib/chart_helpers/barchart";
import { exceptions, titleExceptions } from "../../lib/exceptions";
import formatters from "../../lib/chart_helpers/formatters";
import FilterSelect from "../select/FilterSelect";

/**
 * Retrieves the top downloads report from the passed data URL and creates a
 * visualization for the count of users downloading files for the current
 * agency.
 *
 * @param {object} props the properties for the component
 * @param {string} props.agency the agency display name to be used in the chart
 * description.
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @param {number} props.numberOfListingsToDisplay the count of downloads
 * listings to display in the bar chart.
 * @returns {import('react').ReactElement} The rendered element
 */
function TopVideoPlays({ agency, dataHrefBase, numberOfListingsToDisplay }) {
  const reportFilters = [
    ["Last 7 Days", "top-video-plays-7-days"],
    ["Last 30 Days", "top-video-plays-30-days"],
    ["Last 90 Days", "top-video-plays-90-days"],
    ["Current Calendar Year", "top-video-plays-current-year"],
    ["Current Fiscal Year", "top-video-plays-current-fiscal-year"],
    ["Previous Calendar Year", "top-video-plays-previous-year"],
    ["Previous Fiscal Year", "top-video-plays-previous-fiscal-year"],
  ];
  const [currentFilter, setCurrentFilter] = useState(reportFilters[0]);
  const [shouldDisplayVideoPlays, setShouldDisplayVideoPlays] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    const initChart = async () => {
      if (currentFilter) {
        await loadDataAndBuildChart();
      }
    };
    initChart().catch(console.error);
  }, [currentFilter]);

  async function loadDataAndBuildChart() {
    let data;

    try {
      data = await DataLoader.loadJSON(
        `${dataHrefBase}/${currentFilter[1]}.json`,
      );
    } catch (e) {
      data = { data: [] };
    }
    await buildChartForData(data);
  }

  async function buildChartForData(data) {
    let videoData;
    if (data && data.data && Array.isArray(data.data) && data.data.length > 2) {
      videoData = data;
      setShouldDisplayVideoPlays(true);
    } else {
      videoData = { data: [] };
      setShouldDisplayVideoPlays(false);
    }

    const chartBuilder = new ChartBuilder();
    await chartBuilder
      .setElement(ref.current)
      .setData(videoData)
      .setTransformer((d) => d.data.slice(0, numberOfListingsToDisplay))
      .setRenderer((selection) => {
        const barchartRenderer = barChart()
          .label((d) => d.video_title)
          .value((d) => +d.total_events)
          .scale((values) =>
            d3.scale
              .linear()
              .domain([0, 1, d3.max(values)])
              .rangeRound([0, 1, 100]),
          )
          .format(formatters.addCommas);

        barchartRenderer(selection);

        // turn the labels into links
        selection
          .selectAll(".chart__bar-chart__item__label")
          .each(function (d) {
            d.text = this.innerText;
          })
          .html("")
          .append("a")
          .attr("target", "_blank")
          .attr("rel", "noopener")
          .attr("href", (d) => exceptions[d.video_url] || d.video_url)
          .text((d) => titleExceptions[d.video_title] || d.video_title);
      })
      .build();
  }

  async function filterChangeHandler(fileName) {
    if (!fileName) return;

    const selectedFilter = reportFilters.find((reportFilter) => {
      return reportFilter[1] == fileName;
    });
    await setCurrentFilter(selectedFilter);
  }

  function timeIntervalDescription() {
    return `over the ${currentFilter[0].toLowerCase()}`;
  }

  return (
    <>
      <p className="margin-top-0 margin-bottom-1">
        <em>
          {shouldDisplayVideoPlays
            ? `Top videos played ${timeIntervalDescription()} on ${agency} hostnames.`
            : `Video play data ${timeIntervalDescription()} is unavailable for ${agency} hostnames.`}
        </em>
      </p>
      <div className="grid-row">
        <div className="display-flex card:grid-col-12 mobile-lg:grid-col-auto card:flex-justify-center mobile-lg:flex-justify-start card:padding-bottom-105 mobile-lg:padding-bottom-0 padding-right-1">
          {shouldDisplayVideoPlays && (
            <p className="margin-top-05 margin-bottom-05">
              <a
                href={`${dataHrefBase}/${currentFilter[1]}.csv`}
                aria-label={`${currentFilter[1]}.csv`}
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
        <div className="card:grid-col-12 mobile-lg:grid-col-fill">
          <div className="display-flex card:flex-justify-center mobile-lg:flex-justify-end">
            <FilterSelect
              filters={reportFilters}
              defaultFilterValue={reportFilters[0][1] || ""}
              onChange={filterChangeHandler}
              name={"top video plays chart time filter"}
              className="maxw-full text--overflow-ellipsis"
            />
          </div>
        </div>
      </div>
      {shouldDisplayVideoPlays && (
        <figure className="top-video-plays__bar-chart" ref={ref}>
          <div className="data chart__bar-chart text--capitalize margin-top-2"></div>
        </figure>
      )}
    </>
  );
}

TopVideoPlays.propTypes = {
  agency: PropTypes.string.isRequired,
  dataHrefBase: PropTypes.string.isRequired,
  numberOfListingsToDisplay: PropTypes.number.isRequired,
};

export default TopVideoPlays;
