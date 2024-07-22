import React from "react";
import PropTypes from "prop-types";

import RealtimeVisitors from "./RealtimeVisitors";
import LocationsAndLanguages from "./LocationsAndLanguages";
import Sessions30Days from "./Sessions30Days";
import Visitors30Days from "./Visitors30Days";
import Engagement from "./Engagement";
import TrafficSources from "./TrafficSources";
import DeviceDemographics from "./DeviceDemographics";
import TopPagesAndDownloads from "./TopPagesAndDownloads";

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
function MainCharts({ dataURL, dataPrefix, agency }) {
  const dataHrefBase = `${dataURL}/${dataPrefix}`;

  return (
    <>
      <section id="main_data" className="desktop:grid-col-8">
        <article className="chart-realtime">
          <RealtimeVisitors dataHrefBase={dataHrefBase} agency={agency} />
        </article>

        <article className="section locations-and-languages-section">
          <LocationsAndLanguages dataHrefBase={dataHrefBase} />
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
            <h2>Top Traffic Sources in the Last 30 Days</h2>
          </div>

          <section className="section__chart">
            <div className="grid-row">
              <TrafficSources dataHrefBase={dataHrefBase} />
            </div>
          </section>
        </article>

        <article className="section device-demographics-section">
          <div className="section__headline">
            <h2>User Device Demographics in the Last 30 Days</h2>
          </div>

          <section className="section__chart">
            <div className="grid-row">
              <DeviceDemographics dataHrefBase={dataHrefBase} />
            </div>
          </section>
        </article>
      </section>

      <section id="secondary_data" className="desktop:grid-col-4">
        <TopPagesAndDownloads dataHrefBase={dataHrefBase} agency={agency} />
      </section>
    </>
  );
}

MainCharts.propTypes = {
  dataURL: PropTypes.string.isRequired,
  dataPrefix: PropTypes.string.isRequired,
  agency: PropTypes.string.isRequired,
};

export default MainCharts;
