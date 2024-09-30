import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import colorbrewer from "colorbrewer";
import d3 from "d3";

import DataLoader from "../../lib/data_loader";
import pieChart from "../../lib/chart_helpers/pie_chart";
import formatters from "../../lib/chart_helpers/formatters";
import transformers from "../../lib/chart_helpers/transformers";
import Square from "../chart/Square";

/**
 * Retrieves the OperatingSystems report from the passed data URL and creates a
 * visualization for the breakdown of OperatingSystems of users visiting sites for the
 * current agency.
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @returns {import('react').ReactElement} The rendered element
 */
function UsersPieChartWithKey({ dataHrefBase }) {
  const totalUsersDataUrl = `${dataHrefBase}/users-30-days.json`;
  const usersWithFileDownloadsDataURL = `${dataHrefBase}/users-with-file-downloads-30-days.json`;
  const ref = useRef(null);
  const [totalUsersData, setTotalUsersData] = useState(null);
  const [usersWithFileDownloadsData, setUsersWithFileDownloadsData] =
    useState(null);
  const [pieSvgWidth, setPieSvgWidth] = useState(null);
  const [pieData, setPieData] = useState(null);

  useEffect(() => {
    const initUsersPieChartWithKey = async () => {
      if (!pieSvgWidth) {
        const resizeObserver = new ResizeObserver((entries) => {
          const element = entries[0].target;
          setPieSvgWidth(element.getBoundingClientRect().width);
        });
        resizeObserver.observe(ref.current);
      }
      if (!totalUsersData) {
        const data = await DataLoader.loadJSON(totalUsersDataUrl);
        await setTotalUsersData(data);
      } else if (!usersWithFileDownloadsData) {
        const data = await DataLoader.loadJSON(usersWithFileDownloadsDataURL);
        await setUsersWithFileDownloadsData(data);
      } else if (!pieData) {
        const usersWithoutFileDownloads =
          totalUsersData.totals.users - usersWithFileDownloadsData.totals.users;
        setPieData(
          transformers
            .findProportionsOfMetricFromValue(
              transformers.listify({
                "Users with file downloads":
                  usersWithFileDownloadsData.totals.users,
                "Users without file downloads": usersWithoutFileDownloads,
              }),
            )
            .map((item) => {
              item.key = `${item.key} (${formatters.floatToPercent(item.proportion)})`;
              return item;
            }),
        );
      } else {
        await d3
          .select(ref.current)
          .selectAll(":scope > .chart__pie-chart__container")
          .remove();

        await pieChart.render({
          ref: ref.current,
          data: pieData,
          width: pieSvgWidth,
          colorSet: colorbrewer[colorbrewer.schemeGroups.qualitative[2]][8],
        });
      }
    };
    initUsersPieChartWithKey().catch(console.error);
  }, [totalUsersData, usersWithFileDownloadsData, pieSvgWidth, pieData]);

  function renderKeyItems(data) {
    return (
      <>
        {data.map((dataItem, index) => {
          return renderKeyItem(dataItem, index);
        })}
      </>
    );
  }

  function renderKeyItem(dataItem, index) {
    return (
      <div key={index} className="grid-row">
        <div className="grid-col-1">
          <Square
            color={
              colorbrewer[colorbrewer.schemeGroups.qualitative[2]][8][index]
            }
          />
        </div>
        <div className="grid-col-11 padding-left-1 text--medium text--left">
          {dataItem.key}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid-row">
        <div className="grid-col-6">
          <figure id="pie_chart_user_engagement_downloads" ref={ref}></figure>
        </div>
        <div className="grid-col-6">
          <div className="chart__pie-chart__key">
            {pieData ? renderKeyItems(pieData) : ""}
          </div>
        </div>
      </div>
    </>
  );
}

UsersPieChartWithKey.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default UsersPieChartWithKey;
