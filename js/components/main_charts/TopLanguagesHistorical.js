import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import d3 from "d3";

import renderBlock from "../../lib/chart_helpers/renderblock";
import transformers from "../../lib/chart_helpers/transformers";

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
function TopLanguagesHistorical({ dataHrefBase }) {
  const dataURL = `${dataHrefBase}/language.json`;
  const ref = useRef(null);

  useEffect(() => {
    const initHistoricalLanguagesChart = async () => {
      const result = await d3
        .select(ref.current)
        .datum({
          source: dataURL,
          block: ref.current,
        })
        .call(
          renderBlock.buildBarChartWithLabel((d) => {
            // 1. filter out non-languages - (other)
            // 2. convert object into array of objects
            // 3. sort desc by visitors #

            const languages = d.totals.by_language;
            const keysToExclude = ["(other)"];
            const filteredLanguages = {};

            for (const key in languages) {
              if (!keysToExclude.includes(key)) {
                filteredLanguages[key] = languages[key];
              }
            }

            const languagesArray = [];
            for (const [key, value] of Object.entries(filteredLanguages)) {
              languagesArray.push({ language: key, visitors: value });
            }

            d.totals.by_language = languagesArray;

            const values = transformers.findProportionsOfMetric(
              d.totals.by_language,
              (list) => list.map((x) => x.visitors),
            );

            return values.slice(0, 10);
          }, "language"),
        );
      return result;
    };
    initHistoricalLanguagesChart().catch(console.error);
  }, []);

  return (
    <>
      <figure id="chart_top-languages" data-block="languages" ref={ref}>
        <div className="data bar-chart"></div>
      </figure>
    </>
  );
}

TopLanguagesHistorical.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default TopLanguagesHistorical;
