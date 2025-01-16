import React from "react";
import PropTypes from "prop-types";

import DevicesChart from "./DevicesChart";
import BrowsersChart from "./BrowsersChart";
import OperatingSystemsChart from "./OperatingSystemsChart";
import ConsolidatedBarChart from "../chart/ConsolidatedBarChart";
import Tooltip from "../tooltip/Tooltip";
import Card from "../card/Card";
import CardContent from "../card/CardContent";
import CardGroup from "../card/CardGroup";

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
    <CardGroup className="grid-row desktop:grid-gap-2 card:padding-x-1 desktop:padding-x-0">
      <Card className="desktop:grid-col-4 card:padding-bottom-2 desktop:padding-bottom-0">
        <CardContent className="height-auto">
          <CardGroup className="grid-row padding-0 bg-light-gray">
            <Card className="grid-col-12">
              <CardContent className="padding-105 margin-0 border-0 height-auto">
                <DevicesChart dataHrefBase={dataHrefBase} />
              </CardContent>
            </Card>
            <Card className="grid-col-12 padding-top-2">
              <CardContent className="padding-105 margin-0 border-0 height-auto">
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
          </CardGroup>
        </CardContent>
      </Card>

      <Card className="desktop:grid-col-4 card:padding-bottom-2 desktop:padding-bottom-0">
        <CardContent className="padding-105 margin-0 border-0 height-auto">
          <BrowsersChart dataHrefBase={dataHrefBase} />
        </CardContent>
      </Card>

      <Card className="desktop:grid-col-4">
        <CardContent className="padding-105 margin-0 border-0 height-auto">
          <OperatingSystemsChart dataHrefBase={dataHrefBase} />
        </CardContent>
      </Card>
    </CardGroup>
  );
}

DeviceDemographics.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
};

export default DeviceDemographics;
