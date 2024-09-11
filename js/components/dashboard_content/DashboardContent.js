import React from "react";
import PropTypes from "prop-types";

import Config from "../../lib/config";
import DeviceDemographics from "./DeviceDemographics";
import Engagement from "./Engagement";
import FileDownloads from "./FileDownloads";
import LocationsAndLanguages from "./LocationsAndLanguages";
import RealtimeVisitors from "./RealtimeVisitors";
import Sessions30Days from "./Sessions30Days";
import SidebarContent from "./SidebarContent";
import TrafficSources from "./TrafficSources";
import Visitors30Days from "./Visitors30Days";

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
      <article id="main_data" className="desktop:grid-col-8">
        <section className="section padding-4">
          <RealtimeVisitors
            dataHrefBase={dataHrefBase}
            agency={agency}
            refreshSeconds={Config.realtimeDataRefreshSeconds}
          />
        </section>

        <article className="min-height-large padding-3 section section--bordered">
          <LocationsAndLanguages dataHrefBase={dataHrefBase} />
        </article>

        <article className="padding-3 section section--bordered">
          <div className="section__headline">
            30 Day Historical Data and Trends
          </div>
        </article>

        <article className="min-height-small padding-3 section section--bordered">
          <Sessions30Days dataHrefBase={dataHrefBase} />
        </article>

        <article className="section section--bordered">
          <section className="section__subheader padding-2 text--centered">
            <Visitors30Days dataHrefBase={dataHrefBase} />
          </section>
        </article>

        <article className="section section--bordered">
          <section>
            <Engagement dataHrefBase={dataHrefBase} />
          </section>
        </article>

        <article className="min-height-large padding-3 section section--bordered">
          <div className="section__headline">
            <a href="/definitions#report_historical_top_traffic_sources">
              Top Traffic Sources
            </a>
          </div>
          <TrafficSources dataHrefBase={dataHrefBase} />
        </article>

        <article className="min-height-large padding-3 section section--bordered">
          <div className="section__headline">
            <a href="/definitions#report_historical_device_demographics">
              User Device Demographics
            </a>
          </div>
          <DeviceDemographics dataHrefBase={dataHrefBase} />
        </article>

        <article className="min-height-large padding-3 section section--bordered">
          <div className="section__headline">File Downloads</div>
          <FileDownloads dataHrefBase={dataHrefBase} />
        </article>
      </article>

      <article id="secondary_data" className="desktop:grid-col-4">
        <SidebarContent dataHrefBase={dataHrefBase} agency={agency} />
      </article>
    </>
  );
}

DashboardContent.propTypes = {
  dataURL: PropTypes.string.isRequired,
  dataPrefix: PropTypes.string.isRequired,
  agency: PropTypes.string.isRequired,
};

export default DashboardContent;
