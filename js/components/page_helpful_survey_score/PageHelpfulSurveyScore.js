import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CircularProgressbar } from "react-circular-progressbar";

import DataLoader from "../../lib/data_loader";

/**
 * Loads the data
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataURL the URL of the base location of the data to be
 * displayed In production this is proxied and redirected to the S3 bucket URL
 * by NGINX.
 * @returns {import('react').ReactElement} The rendered element
 */
function PageHelpfulSurveyScore({ dataURL }) {
  const jsonURL = `${dataURL}/analytics.usa.gov/was-this-page-helpful-30-days.json`;
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const initChart = async () => {
      if (!percentage) {
        await loadData();
      }
    };
    initChart().catch(console.error);
  }, []);

  async function loadData() {
    let data;

    try {
      data = await DataLoader.loadJSON(jsonURL);
    } catch (e) {
      data = { data: [], totals: {} };
    }

    if (
      data &&
      data.totals &&
      data.totals["by_customEvent:event_label"] &&
      data.totals["by_customEvent:event_label"]
    ) {
      const calculatedValue =
        (data.totals["by_customEvent:event_label"]["yes"] /
          data.totals.total_events) *
        100;
      await setPercentage(Math.round(calculatedValue));
    }
  }

  return <CircularProgressbar value={percentage} text={`${percentage}% Yes`} />;
}

PageHelpfulSurveyScore.propTypes = {
  dataURL: PropTypes.string.isRequired,
};

export default PageHelpfulSurveyScore;
