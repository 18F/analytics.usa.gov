import React from "react";
import PropTypes from "prop-types";

import Config from "../../lib/config";
import DeviceDemographics from "./DeviceDemographics";
import DevicesPieChart from "./DevicesPieChart";
import Engagement from "./Engagement";
import LocationsAndLanguages from "./LocationsAndLanguages";
import RealtimeVisitors from "./RealtimeVisitors";
import Sessions30Days from "./Sessions30Days";
import SidebarContent from "./SidebarContent";
import TrafficSources from "./TrafficSources";
import Visitors30Days from "./Visitors30Days";
import OperatingSystemsPieChart from "./OperatingSystemsPieChart";

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
      <section id="main_data" className="desktop:grid-col-8">
        <article className="chart-realtime">
          <RealtimeVisitors
            dataHrefBase={dataHrefBase}
            agency={agency}
            refreshSeconds={Config.realtimeDataRefreshSeconds}
          />
        </article>

        <article className="section locations-and-languages-section">
          <LocationsAndLanguages dataHrefBase={dataHrefBase} />
        </article>

        <article className="section">
          <div className="section__chart grid-row">
            <section className="desktop:grid-col-6 padding-2">
              <div className="section__headline">
                <h3>Devices Pie</h3>
              </div>
              <DevicesPieChart dataHrefBase={dataHrefBase} />
            </section>

            <section className="desktop:grid-col-6 padding-2">
              <div className="section__headline">
                <h3>Operating Systems Pie</h3>
              </div>
              <OperatingSystemsPieChart dataHrefBase={dataHrefBase} />
            </section>
          </div>
        </article>

        <article className="section">
          <div className="section__headline">
            <h2>Historical Data and Trends</h2>
          </div>
        </article>

        <article className="section sessions-30-days-section">
          <div className="section__headline">
            <h3>Daily Sessions in the Past 30 Days</h3>
          </div>
          <Sessions30Days dataHrefBase={dataHrefBase} />
        </article>

        <article className="section">
          <section className="section__subheader">
            <Visitors30Days dataHrefBase={dataHrefBase} />
          </section>
        </article>

        <article className="section">
          <section className="section__rate">
            <div className="grid-row">
              <Engagement dataHrefBase={dataHrefBase} />
            </div>
          </section>
        </article>

        <article className="section traffic-sources-section">
          <div className="section__headline">
            <h2>
              <a href="/definitions#report_historical_top_traffic_sources">
                Top Traffic Sources in the Last 30 Days
              </a>
            </h2>
          </div>

          <section className="section__chart">
            <div className="grid-row">
              <TrafficSources dataHrefBase={dataHrefBase} />
            </div>
          </section>
        </article>

        <article className="section device-demographics-section">
          <div className="section__headline">
            <h2>
              <a href="/definitions#report_historical_device_demographics">
                User Device Demographics in the Last 30 Days
              </a>
            </h2>
          </div>

          <section className="section__chart">
            <div className="grid-row">
              <DeviceDemographics dataHrefBase={dataHrefBase} />
            </div>
          </section>
        </article>
      </section>

      <section id="secondary_data" className="desktop:grid-col-4">
        <SidebarContent dataHrefBase={dataHrefBase} agency={agency} />
      </section>
    </>
  );
}

DashboardContent.propTypes = {
  dataURL: PropTypes.string.isRequired,
  dataPrefix: PropTypes.string.isRequired,
  agency: PropTypes.string.isRequired,
};

export default DashboardContent;
