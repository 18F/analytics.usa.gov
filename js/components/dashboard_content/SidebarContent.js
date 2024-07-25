import React from "react";
import PropTypes from "prop-types";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import Config from "../../lib/config";
import TopDownloadsAndVideoPlays from "./TopDownloadsAndVideoPlays";
import TopPagesRealtime from "./TopPagesRealtime";
import TopPagesHistorical from "./TopPagesHistorical";

/**
 * Contains charts and other data visualizations for the top pages, top
 * downloads, and top video plays section of the site. This component is mainly
 * laying out the structure for the section, including tabs/panels, and passes
 * props necessary for getting data and displaying visualizations to child
 * components. The top pages chart, top downloads chart, and top video plays
 * displayed correspond to the time interval selected in the tabs.
 *
 *
 * Note that the 30 minutes time interval is how often Google Analytics 4
 * updates realtime reports. The dimensions/metrics needed to report on file
 * downloads are not available in the realtime reporting API, so for the 30
 * minute time interval, show top downloads and top video plays for the past day
 * (the shortest time interval allowed for the non-realtime reporting API.)
 *
 * @param {object} props the properties for the component
 * @param {string} props.dataHrefBase the URL of the base location of the data
 * to be downloaded including the agency path. In production this is proxied and
 * redirected to the S3 bucket URL.
 * @param {string} props.agency the display name for the current agency.
 * @returns {import('react').ReactElement} The rendered element
 */
function SidebarContent({ dataHrefBase, agency }) {
  const numberOfTopPagesToDisplay = 30;

  return (
    <section className="sidebar-content">
      <div className="sidebar-content__headline">
        <h2>
          <a href="/definitions#report_realtime_top_pages">
            Top {numberOfTopPagesToDisplay} Web Pages and App Screens
          </a>
        </h2>
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
              <strong>Users</strong> on a{" "}
              <strong>single, specific page or app screen</strong> in the last
              30 minutes. Hostnames are not currently reported in real-time, so
              only page title and screen name information is available.
            </p>
            <TopPagesRealtime
              dataHrefBase={dataHrefBase}
              reportFileName="top-pages-realtime.json"
              numberOfListingsToDisplay={numberOfTopPagesToDisplay}
              refreshSeconds={Config.realtimeDataRefreshSeconds}
            />
          </section>
          <TopDownloadsAndVideoPlays
            dataHrefBase={dataHrefBase}
            agency={agency}
            downloadsReportFileName="top-downloads-yesterday.json"
            videoPlaysReportFileName="top-video-plays-yesterday.json"
            timeIntervalHeader="Yesterday"
            timeIntervalDescription="yesterday"
          />
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
          <TopDownloadsAndVideoPlays
            dataHrefBase={dataHrefBase}
            agency={agency}
            downloadsReportFileName="top-downloads-7-days.json"
            videoPlaysReportFileName="top-video-plays-7-days.json"
            timeIntervalHeader="Last 7 Days"
            timeIntervalDescription="over the last week"
          />
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
          <TopDownloadsAndVideoPlays
            dataHrefBase={dataHrefBase}
            agency={agency}
            downloadsReportFileName="top-downloads-30-days.json"
            videoPlaysReportFileName="top-video-plays-30-days.json"
            timeIntervalHeader="Last 30 Days"
            timeIntervalDescription="over the last month"
          />
        </TabPanel>
      </Tabs>
    </section>
  );
}

SidebarContent.propTypes = {
  dataHrefBase: PropTypes.string.isRequired,
  agency: PropTypes.string.isRequired,
};

export default SidebarContent;
