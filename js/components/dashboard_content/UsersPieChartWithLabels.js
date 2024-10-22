import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import colorbrewer from "colorbrewer";
import d3 from "d3";

import DataLoader from "../../lib/data_loader";
import pieChart from "../../lib/chart_helpers/pie_chart";
import transformers from "../../lib/chart_helpers/transformers";

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
function UsersPieChartWithLabels({ dataHrefBase }) {
  const totalUsersDataUrl = `${dataHrefBase}/users-30-days.json`;
  const usersWithFileDownloadsDataURL = `${dataHrefBase}/users-with-file-downloads-30-days.json`;
  const ref = useRef(null);
  const [totalUsersData, setTotalUsersData] = useState(null);
  const [usersWithFileDownloadsData, setUsersWithFileDownloadsData] =
    useState(null);
  const [pieSvgWidth, setPieSvgWidth] = useState(null);
  const [pieData, setPieData] = useState(null);

  useEffect(() => {
    const initUsersPieChartWithLabels = async () => {
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
          transformers.listify({
            "Users with file downloads":
              usersWithFileDownloadsData.totals.users,
            "Users without file downloads": usersWithoutFileDownloads,
          }),
        );
      } else {
        await d3
          .select(ref.current)
          .selectAll(":scope > .chart__pie-chart__container")
          .remove();

        const dataWithProportions =
          transformers.findProportionsOfMetricFromValue(pieData);

        await pieChart.renderWithLabels({
          ref: ref.current,
          data: dataWithProportions,
          width: pieSvgWidth,
          colorSet: colorbrewer[colorbrewer.schemeGroups.qualitative[2]][8],
        });
      }
    };
    initUsersPieChartWithLabels().catch(console.error);
  }, [totalUsersData, usersWithFileDownloadsData, pieSvgWidth, pieData]);

  return (
    <>
      <figure id="pie_chart_user_engagement_downloads" ref={ref}></figure>
    </>
  );
}

UsersPieChartWithLabels.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default UsersPieChartWithLabels;
