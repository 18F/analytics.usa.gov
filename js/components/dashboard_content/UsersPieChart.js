import React, { useRef, useEffect, useState } from "react";
import PropTypes from "prop-types";
import colorbrewer from "colorbrewer";

import DataLoader from "../../lib/data_loader";
import renderPieChart from "../../lib/chart_helpers/pie_chart";
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
function UsersPieChart({ dataHrefBase }) {
  const totalUsersDataUrl = `${dataHrefBase}/users-30-days.json`;
  const usersWithFileDownloadsDataURL = `${dataHrefBase}/users-with-file-downloads-30-days.json`;
  const ref = useRef(null);
  const [totalUsersData, setTotalUsersData] = useState(null);
  const [usersWithFileDownloadsData, setUsersWithFileDownloadsData] =
    useState(null);
  const [pieSvgWidth, setPieSvgWidth] = useState(null);

  useEffect(() => {
    const initUsersPieChart = async () => {
      if (!pieSvgWidth) {
        const resizeObserver = new ResizeObserver((entries) => {
          console.log(entries[0].target.getBoundingClientRect().width);
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
      } else {
        console.log(totalUsersData);
        console.log(usersWithFileDownloadsData);
        const usersWithoutFileDownloads =
          totalUsersData.totals.users - usersWithFileDownloadsData.totals.users;
        const userPieData = transformers.listify({
          "Users with file downloads": usersWithFileDownloadsData.totals.users,
          "Users without file downloads": usersWithoutFileDownloads,
        });
        const dataWithProportions =
          transformers.findProportionsOfMetricFromValue(userPieData);

        console.log(dataWithProportions);
        await renderPieChart({
          ref: ref.current,
          data: dataWithProportions,
          width: pieSvgWidth,
          colorSet: colorbrewer[colorbrewer.schemeGroups.qualitative[2]][8],
        });
      }
    };
    initUsersPieChart().catch(console.error);
  }, [totalUsersData, usersWithFileDownloadsData, pieSvgWidth]);

  return (
    <>
      <figure id="pie_chart_user_engagement_downloads" ref={ref}></figure>
    </>
  );
}

UsersPieChart.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default UsersPieChart;
