import React from "react";
import PropTypes from "prop-types";

import DevicesChart from "./DevicesChart";
import BrowsersChart from "./BrowsersChart";
import OperatingSystemsChart from "./OperatingSystemsChart";
import ConsolidatedBarChart from "../chart/ConsolidatedBarChart";
import Tooltip from "../tooltip/Tooltip";
import Card from "../card/Card";
import CardContent from "../card/CardContent";

/**
 * Contains charts and other data visualizations for the user demographics
 * section of the site. This component is mainly laying out the structure for
 * the section and passes props necessary for getting data and displaying
 * visualizations to child components.
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @returns {import('react').ReactElement} The rendered element
 */
function DeviceDemographics({ dataHrefBase }) {
  return (
    <div className="grid-row desktop:grid-gap-2">
      <div
        id="devices"
        className="desktop:grid-col-4 card:padding-bottom-2 desktop:padding-bottom-0"
      >
        <Card>
          <CardContent className="padding-105 margin-0 border-0">
            <DevicesChart dataHrefBase={dataHrefBase} />
          </CardContent>
        </Card>
        <Card className="padding-top-2">
          <CardContent className="padding-105 margin-0 border-0">
            <div className="chart__title">
              <a href="/definitions#dimension_screen_resolution">
                <Tooltip
                  position="top"
                  content="The width and height (in pixels) of the screen from which user activity originates."
                >
                  Top Screen Resolutions
                </Tooltip>
              </a>
              <a
                href={`${dataHrefBase}/screen-resolution-30-days.csv`}
                aria-label="screen-resolution-30-days.csv"
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
            </div>
            <div className="text--capitalize">
              <ConsolidatedBarChart
                dataUrl={`${dataHrefBase}/screen-resolution-30-days.json`}
                chartDataKey={"screen_resolution"}
                maxItems={10}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div
        id="browsers"
        className="desktop:grid-col-4 card:padding-bottom-2 desktop:padding-bottom-0"
      >
        <Card>
          <CardContent className="padding-105 margin-0 border-0">
            <BrowsersChart dataHrefBase={dataHrefBase} />
          </CardContent>
        </Card>
      </div>

      <div id="operating_systems" className="desktop:grid-col-4">
        <Card>
          <CardContent className="padding-105 margin-0 border-0">
            <OperatingSystemsChart dataHrefBase={dataHrefBase} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

DeviceDemographics.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default DeviceDemographics;
