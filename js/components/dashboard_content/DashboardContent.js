import React from "react";
import PropTypes from "prop-types";

import Config from "../../lib/config";
import DeviceDemographics from "./DeviceDemographics";
import Engagement from "./Engagement";
import Sessions30Days from "./Sessions30Days";
import SidebarContent from "./SidebarContent";
import TrafficSources from "./TrafficSources";
import Visitors30Days from "./Visitors30Days";
import Card from "../card/Card";
import CardContent from "../card/CardContent";
import CardGroup from "../card/CardGroup";
import RealtimeMetricCount from "../data_visualization/RealtimeMetricCount";
import RealtimeEventCount from "../data_visualization/RealtimeEventCount";
import TopCitiesRealtime from "./TopCitiesRealtime";
import TopCountriesRealtime from "./TopCountriesRealtime";
import TopLanguagesHistorical from "./TopLanguagesHistorical";

/**
 * Contains charts and other data visualizations for the main page of the site.
 * This component is mainly laying out the structure for the page and passes
 * props necessary for getting data and displaying visualizations to child
 * components.
 *
 * This component is using USWDS grid classes and expects it's parent element to
 * have class 'grid-row'
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataURL the URL of the base location of the data to be
 * displayed In production this is proxied and redirected to the S3 bucket URL
 * by NGINX.
 * @param {string} props.dataPrefix the path to add to the base URL to find data
 * for the current agency.
 * @param {string} props.agency the display name for the current agency.
 * @returns {import('react').ReactElement} The rendered element
 */
function DashboardContent({ dataURL, dataPrefix, agency }) {
  const dataHrefBase = `${dataURL}/${dataPrefix}`;

  return (
    <>
      <div className="grid-row">
        <div className="grid-col-12">
          <h1 className="margin-top-0 text--semibold">
            {agency} Website and App Analytics
          </h1>
        </div>
      </div>
      <CardGroup>
        <Card className="card:grid-col-12 tablet:grid-col-6 desktop:grid-col-3">
          <CardContent className="white bg-palette-color-1 text-center text--bold">
            <div className="usa-card__body">
              <p className="text--header-xl margin-0">Total Users</p>
              <p className="text--header-3xl margin-bottom-0 margin-top-neg-1">
                <RealtimeMetricCount
                  dataHrefBase={dataHrefBase}
                  refreshSeconds={Config.realtimeDataRefreshSeconds}
                  metricName={"activeUsers"}
                />
              </p>
              <p className="text--header-lg margin-0">in the last 30 minutes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card:grid-col-12 tablet:grid-col-6 desktop:grid-col-3">
          <CardContent className="white bg-palette-color-2 text-center text--bold">
            <div className="usa-card__body">
              <p className="text--header-xl margin-0">First Time Users</p>
              <p className="text--header-3xl margin-bottom-0 margin-top-neg-1">
                <RealtimeEventCount
                  dataHrefBase={dataHrefBase}
                  refreshSeconds={Config.realtimeDataRefreshSeconds}
                  eventName={"first_visit"}
                />
              </p>
              <p className="text--header-lg margin-0">in the last 30 minutes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card:grid-col-12 tablet:grid-col-6 desktop:grid-col-3">
          <CardContent className="white bg-palette-color-3 text-center text--bold">
            <div className="usa-card__body">
              <p className="text--header-xl margin-0">Total Views</p>
              <p className="text--header-3xl margin-bottom-0 margin-top-neg-1">
                <RealtimeMetricCount
                  dataHrefBase={dataHrefBase}
                  refreshSeconds={Config.realtimeDataRefreshSeconds}
                  metricName={"pageviews"}
                />
              </p>
              <p className="text--header-lg margin-0">in the last 30 minutes</p>
            </div>
          </CardContent>
        </Card>
        <Card className="card:grid-col-12 tablet:grid-col-6 desktop:grid-col-3">
          <CardContent className="white bg-palette-color-4 text-center text--bold">
            <div className="usa-card__body">
              <p className="text--header-xl margin-0">Files Downloaded</p>
              <p className="text--header-3xl margin-bottom-0 margin-top-neg-1">
                <RealtimeEventCount
                  dataHrefBase={dataHrefBase}
                  refreshSeconds={Config.realtimeDataRefreshSeconds}
                  eventName={"file_download"}
                />
              </p>
              <p className="text--header-lg margin-0">in the last 30 minutes</p>
            </div>
          </CardContent>
        </Card>
      </CardGroup>
      <CardGroup>
        <Card className="card:grid-col-12 desktop:grid-col-8">
          <CardContent>
            <div id="main_data" className="usa-card__body">
              <article className="min-height-large section">
                <h2 className="section__headline margin-0">
                  <a href="/definitions#report_realtime_locations_languages">
                    User Locations and Languages in the Last 30 Minutes
                  </a>
                </h2>
                <CardGroup className="padding-top-2">
                  <Card className="card:grid-col-12 tablet:grid-col-6 desktop:grid-col-4">
                    <CardContent className="no-border desktop:padding-right-1">
                      <TopCitiesRealtime
                        dataHrefBase={dataHrefBase}
                        refreshSeconds={Config.realtimeDataRefreshSeconds}
                      />
                    </CardContent>
                  </Card>
                  <Card className="card:grid-col-12 tablet:grid-col-6 desktop:grid-col-4">
                    <CardContent className="no-border desktop:padding-x-1">
                      <TopCountriesRealtime
                        dataHrefBase={dataHrefBase}
                        refreshSeconds={Config.realtimeDataRefreshSeconds}
                      />
                    </CardContent>
                  </Card>
                  <Card className="card:grid-col-12 tablet:grid-col-6 desktop:grid-col-4">
                    <CardContent className="no-border desktop:padding-left-1">
                      <TopLanguagesHistorical dataHrefBase={dataHrefBase} />
                    </CardContent>
                  </Card>
                </CardGroup>
              </article>

              <article className="padding-y-3 section section--bordered">
                <h2 className="section__headline margin-0">
                  30 Day Historical Data and Trends
                </h2>
              </article>

              <article className="min-height-small padding-y-3 section section--bordered">
                <h3 className="chart__title margin-0">Daily Sessions</h3>
                <Sessions30Days dataHrefBase={dataHrefBase} />
              </article>

              <article className="section section--bordered">
                <section className="section__subheader padding-2 text-center">
                  <Visitors30Days dataHrefBase={dataHrefBase} />
                </section>
              </article>

              <article className="section section--bordered">
                <section>
                  <Engagement dataHrefBase={dataHrefBase} />
                </section>
              </article>

              <article className="min-height-large padding-y-3 section section--bordered">
                <div className="section__headline">
                  <a href="/definitions#report_historical_top_traffic_sources">
                    Top Traffic Sources
                  </a>
                </div>
                <TrafficSources dataHrefBase={dataHrefBase} />
              </article>

              <article className="min-height-large padding-y-3 section section--bordered">
                <div className="section__headline">
                  <a href="/definitions#report_historical_device_demographics">
                    User Device Demographics
                  </a>
                </div>
                <DeviceDemographics dataHrefBase={dataHrefBase} />
              </article>
            </div>
          </CardContent>
        </Card>
        <Card className="card:grid-col-12 desktop:grid-col-4">
          <CardContent>
            <div id="secondary_data" className="usa-card__body">
              <SidebarContent dataHrefBase={dataHrefBase} agency={agency} />
            </div>
          </CardContent>
        </Card>
      </CardGroup>
    </>
  );
}

DashboardContent.propTypes = {
  dataURL: PropTypes.string.isRequired,
  dataPrefix: PropTypes.string.isRequired,
  agency: PropTypes.string.isRequired,
};

export default DashboardContent;
