import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import DataLoader from "../../lib/data_loader";
import Tooltip from "../tooltip/Tooltip";
import FilterSelect from "../select/FilterSelect";
import ConsolidatedBarChart from "../chart/ConsolidatedBarChart";

/**
 * Retrieves the top languages report from the passed data URL and creates a
 * visualization for the count of users visiting sites with each language
 * setting for the current agency.
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @returns {import('react').ReactElement} The rendered element
 */
function TopLanguages({ dataHrefBase }) {
  const reportFilters = [
    ["Last 7 Days", "languages-7-days"],
    ["Last 30 Days", "languages-30-days"],
    ["Last 90 Days", "languages-90-days"],
    ["Current Calendar Year", "languages-current-year"],
    ["Current Fiscal Year", "languages-current-fiscal-year"],
    ["Previous Calendar Year", "languages-previous-year"],
    ["Previous Fiscal Year", "languages-previous-fiscal-year"],
  ];
  const [currentFilter, setCurrentFilter] = useState(reportFilters[0]);
  const [data, setData] = useState(null);

  useEffect(() => {
    const initChart = async () => {
      if (currentFilter) {
        await loadData();
      }
    };
    initChart().catch(console.error);
  }, [currentFilter]);

  async function loadData() {
    let data;

    try {
      data = await DataLoader.loadJSON(
        `${dataHrefBase}/${currentFilter[1]}.json`,
      );
    } catch (e) {
      data = { data: [] };
    }

    await setData(data);
  }

  async function filterChangeHandler(fileName) {
    if (!fileName) return;

    const selectedFilter = reportFilters.find((reportFilter) => {
      return reportFilter[1] == fileName;
    });
    await setCurrentFilter(selectedFilter);
  }

  return (
    <>
      <div className="grid-row">
        <div className="chart__title display-flex card:grid-col-12 mobile-lg:grid-col-auto card:flex-justify-center mobile-lg:flex-justify-start card:padding-bottom-105 mobile-lg:padding-bottom-0 padding-right-1">
          <a
            href={`${dataHrefBase}/${currentFilter[1]}.csv`}
            aria-label={`${currentFilter[1]}.csv`}
          >
            <svg
              className="usa-icon margin-bottom-neg-05 margin-left-05"
              aria-hidden="true"
              focusable="false"
              role="img"
            >
              <use xlinkHref="/assets/uswds/img/sprite.svg#file_present"></use>
            </svg>
          </a>
          <a href="/definitions#dimension_language">
            <Tooltip
              position="top"
              content="The name of the language of a user's browser or device."
            >
              Languages
            </Tooltip>
          </a>
        </div>
        <div className="card:grid-col-12 mobile-lg:grid-col-fill">
          <div className="display-flex card:flex-justify-center mobile-lg:flex-justify-end">
            <FilterSelect
              filters={reportFilters}
              defaultFilterValue={reportFilters[0][1] || ""}
              onChange={filterChangeHandler}
              name={"language chart time filter"}
              className="maxw-full text--overflow-ellipsis"
            />
          </div>
        </div>
      </div>
      {data && (
        <div className="text--capitalize">
          <ConsolidatedBarChart
            data={data}
            chartDataKey={"language"}
            maxItems={11}
          />
        </div>
      )}
    </>
  );
}

TopLanguages.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default TopLanguages;
