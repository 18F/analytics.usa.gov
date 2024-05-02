import React from "react";
import PropTypes from "prop-types";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

import TopPagesRealtime from "./TopPagesRealtime";
import TopPagesHistorical from "./TopPagesHistorical";

function TopPages({ dataURL, dataPrefix }) {
  const dataHrefBase = `${dataURL}/${dataPrefix}`;

  return (
    <section className="top-pages">
      <div className="top-pages__headline">
        <h2>
          Top <span id="top_table_type">Web Pages and App Screens</span>
        </h2>
      </div>
      <Tabs>
        <TabList className="usa-button-group usa-button-group--segmented">
          <Tab className="usa-button-group__item">
            <button className="usa-button">30 mins</button>
          </Tab>
          <Tab className="usa-button-group__item">
            <button className="usa-button">7 days</button>
          </Tab>
          <Tab className="usa-button-group__item">
            <button className="usa-button">30 days</button>
          </Tab>
        </TabList>

        <TabPanel>
          <p>
            <strong>People</strong> on a{" "}
            <strong>single, specific page or app screen</strong> in the last 30
            minutes. Hostnames are not currently reported in real-time, so only
            page title and screen name information is available.
          </p>
          <TopPagesRealtime
            dataHrefBase={dataHrefBase}
            reportFileName="top-pages-realtime.json"
          />
        </TabPanel>
        <TabPanel>
          <p>
            Sessions over the last week on <strong>hostnames</strong>, including
            traffic to all web pages and app screens within that hostname.
          </p>
          <TopPagesHistorical
            dataHrefBase={dataHrefBase}
            reportFileName="top-domains-7-days.json"
          />
        </TabPanel>
        <TabPanel>
          <p>
            Sessions over the last month on <strong>hostnames</strong>,
            including traffic to all web pages and app screens within that
            hostname.
            <a href={dataHrefBase + "/top-10000-domains-30-days.csv"}>
              Download the full dataset.
            </a>
          </p>
          <TopPagesHistorical
            dataHrefBase={dataHrefBase}
            reportFileName="top-domains-30-days.json"
          />
        </TabPanel>
      </Tabs>
    </section>
  );
}

TopPages.propTypes = {
  dataURL: PropTypes.string.isRequired,
  dataPrefix: PropTypes.string.isRequired,
};

export default TopPages;
