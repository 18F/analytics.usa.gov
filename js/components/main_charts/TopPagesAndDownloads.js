import React from "react";
import PropTypes from "prop-types";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import TopDownloads from "./TopDownloads";
import TopPagesRealtime from "./TopPagesRealtime";
import TopPagesHistorical from "./TopPagesHistorical";

/**
 * Contains charts and other data visualizations for the top pages and top
 * downloads section of the site. This component is mainly laying out the
 * structure for the section, including tabs/panels, and passes props necessary
 * for getting data and displaying visualizations to child components. The top
 * pages chart and top downloads chart displayed correspond to the time interval
 * selected in the tabs.
 *
 * Note that the 30 minutes time interval is how often Google Analytics 4
 * updates realtime reports. The dimensions/metrics needed to report on file
 * downloads are not available in the realtime reporting API, so for the 30
 * minute time interval, show top downloads for the past day (the shortest time
 * interval allowed for the non-realtime reporting API.)
 *
 * @param {String} dataHrefBase the URL of the base location of the data to be
 * downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @param {String} agency the display name for the current agency.
 */
function TopPagesAndDownloads({ dataHrefBase, agency }) {
  const numberOfTopPagesToDisplay = 30;
  const numberOfTopDownloadsToDisplay = 20;

  return (
    <section className="top-pages-and-downloads">
      <div className="top-pages-and-downloads__headline">
        <h2>Top {numberOfTopPagesToDisplay} Web Pages and App Screens</h2>
      </div>
      <Tabs>
        <TabList className="usa-button-group usa-button-group--segmented">
          <Tab className="usa-button-group__item">
            <button type="button" className="usa-button">
              30 mins
            </button>
          </Tab>
          <Tab className="usa-button-group__item">
            <button type="button" className="usa-button">
              7 days
            </button>
          </Tab>
          <Tab className="usa-button-group__item">
            <button type="button" className="usa-button">
              30 days
            </button>
          </Tab>
        </TabList>

        <TabPanel>
          <section className="top-pages">
            <p>
              <strong>People</strong> on a{" "}
              <strong>single, specific page or app screen</strong> in the last
              30 minutes. Hostnames are not currently reported in real-time, so
              only page title and screen name information is available.
            </p>
            <TopPagesRealtime
              dataHrefBase={dataHrefBase}
              reportFileName="top-pages-realtime.json"
              numberOfListingsToDisplay={numberOfTopPagesToDisplay}
            />
          </section>
          <section className="top-downloads">
            <div className="top-downloads__headline">
              <h3>Top {numberOfTopDownloadsToDisplay} Downloads Yesterday</h3>
            </div>
            <h4>
              <em>Total file downloads yesterday on {agency} hostnames.</em>
            </h4>
            <TopDownloads
              dataHrefBase={dataHrefBase}
              reportFileName="top-downloads-yesterday.json"
              numberOfListingsToDisplay={numberOfTopDownloadsToDisplay}
            />
          </section>
        </TabPanel>
        <TabPanel>
          <section className="top-pages">
            <p>
              Sessions over the last week on <strong>hostnames</strong>,
              including traffic to all web pages and app screens within that
              hostname.
            </p>
            <TopPagesHistorical
              dataHrefBase={dataHrefBase}
              reportFileName="top-domains-7-days.json"
              numberOfListingsToDisplay={numberOfTopPagesToDisplay}
            />
          </section>
          <section className="top-downloads">
            <div className="top-downloads__headline">
              <h3>Top {numberOfTopDownloadsToDisplay} Downloads Last Week</h3>
            </div>
            <h4>
              <em>
                Total file downloads over the last week on {agency} hostnames.
              </em>
            </h4>
            <TopDownloads
              dataHrefBase={dataHrefBase}
              reportFileName="top-downloads-7-days.json"
              numberOfListingsToDisplay={numberOfTopDownloadsToDisplay}
            />
          </section>
        </TabPanel>
        <TabPanel>
          <section className="top-pages">
            <p>
              Sessions over the last month on <strong>hostnames</strong>,
              including traffic to all web pages and app screens within that
              hostname.{" "}
              <a href={dataHrefBase + "/top-10000-domains-30-days.csv"}>
                Download the full dataset
              </a>
              .
            </p>
            <TopPagesHistorical
              dataHrefBase={dataHrefBase}
              reportFileName="top-domains-30-days.json"
              numberOfListingsToDisplay={numberOfTopPagesToDisplay}
            />
          </section>
          <section className="top-downloads">
            <div className="top-downloads__headline">
              <h3>Top {numberOfTopDownloadsToDisplay} Downloads Last Month</h3>
            </div>
            <h4>
              <em>
                Total file downloads over the last month on {agency} hostnames.
              </em>
            </h4>
            <TopDownloads
              dataHrefBase={dataHrefBase}
              reportFileName="top-downloads-30-days.json"
              numberOfListingsToDisplay={numberOfTopDownloadsToDisplay}
            />
          </section>
        </TabPanel>
      </Tabs>
    </section>
  );
}

TopPagesAndDownloads.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
  agency: PropTypes.string.isRequired,
};

export default TopPagesAndDownloads;
