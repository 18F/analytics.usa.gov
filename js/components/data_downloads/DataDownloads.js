import React from "react";
import PropTypes from "prop-types";

/**
 * Creates tables with download links for many of the reports that are available
 * in the analytics.usa.gov project's S3 bucket. Downloads are labelled by human
 * readable description and by how often the report is updated. Downloads are
 * available in JSON and CSV format.
 *
 * This component is using USWDS grid classes and expects it's parent element to
 * have class 'grid-row'
 *
 * @param {String} dataURL the URL of the base location of the data to be
 * downloaded. In production this is proxied and redirected to the S3 bucket URL
 * by NGINX.
 * @param {String} dataPrefix the path to add to the base URL to find data for
 * the current agency.
 */
function DataDownloads({ dataURL, dataPrefix }) {
  const hrefBase = `${dataURL}/${dataPrefix}`;
  return (
    <>
      <div className="analytics-data__sessions desktop:grid-col-12">
        <table className="usa-table usa-table--borderless desktop:grid-col-8">
          <caption>
            <h2>User traffic reports</h2>
            <a href="/definitions">See data fields and metrics descriptions</a>
          </caption>
          <thead>
            <tr>
              <th scope="col">Report</th>
              <th scope="col">Time Range</th>
              <th scope="col">Download</th>
              <th scope="col">Update Frequency</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Top pages and screens users are viewing (Page Titles)</td>
              <td>30 minutes</td>
              <td>
                <a
                  href={hrefBase + "/all-pages-realtime.json"}
                  className="download-data usa-button"
                  aria-label="all-pages-realtime.json"
                >
                  JSON
                </a>
                <a
                  href={hrefBase + "/all-pages-realtime.csv"}
                  className="download-data usa-button"
                  aria-label="all-pages-realtime.csv"
                >
                  CSV
                </a>
              </td>
              <td>Every 30 minutes</td>
            </tr>
            <tr>
              <td>Top downloads</td>
              <td>7 days</td>
              <td>
                <a
                  href={hrefBase + "/top-downloads-7-days.json"}
                  className="download-data usa-button"
                  aria-label="top-downloads-7-days.json"
                >
                  JSON
                </a>
                <a
                  href={hrefBase + "/top-downloads-7-days.csv"}
                  className="download-data usa-button"
                  aria-label="top-downloads-7-days.csv"
                >
                  CSV
                </a>
              </td>
              <td>Daily</td>
            </tr>
            <tr>
              <td>Top downloads</td>
              <td>30 days</td>
              <td>
                <a
                  href={hrefBase + "/top-downloads-30-days.json"}
                  className="download-data usa-button"
                  aria-label="top-downloads-30-days.json"
                >
                  JSON
                </a>
                <a
                  href={hrefBase + "/top-downloads-30-days.csv"}
                  className="download-data usa-button"
                  aria-label="top-downloads-30-days.csv"
                >
                  CSV
                </a>
              </td>
              <td>Daily</td>
            </tr>
            <tr>
              <td>Top pages and screens (Full Page Path)</td>
              <td>30 days</td>
              <td>
                <a
                  href={hrefBase + "/top-10000-pages-and-screens-30-days.json"}
                  className="download-data usa-button"
                  aria-label="top-10000-pages-and-screens-30-days.json"
                >
                  JSON
                </a>
                <a
                  href={hrefBase + "/top-10000-pages-and-screens-30-days.csv"}
                  className="download-data usa-button"
                  aria-label="top-10000-pages-and-screens-30-days.csv"
                >
                  CSV
                </a>
              </td>
              <td>Daily</td>
            </tr>
            <tr>
              <td>Top hostnames</td>
              <td>30 days</td>
              <td>
                <a
                  href={hrefBase + "/top-10000-domains-30-days.json"}
                  className="download-data usa-button"
                  aria-label="top-10000-domains-30-days.json"
                >
                  JSON
                </a>
                <a
                  href={hrefBase + "/top-10000-domains-30-days.csv"}
                  className="download-data usa-button"
                  aria-label="top-10000-domains-30-days.csv"
                >
                  CSV
                </a>
              </td>
              <td>Daily</td>
            </tr>
            <tr>
              <td>Top traffic sources</td>
              <td>30 days</td>
              <td>
                <a
                  href={hrefBase + "/top-traffic-sources-30-days.json"}
                  className="download-data usa-button"
                  aria-label="top-traffic-sources-30-days.json"
                >
                  JSON
                </a>
                <a
                  href={hrefBase + "/top-traffic-sources-30-days.csv"}
                  className="download-data usa-button"
                  aria-label="top-traffic-sources-30-days.csv"
                >
                  CSV
                </a>
              </td>
              <td>Daily</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="analytics-data__demographics desktop:grid-col-12 padding-bottom-4">
        <table className="usa-table usa-table--borderless desktop:grid-col-8">
          <caption>
            <h2>User demographics</h2>
          </caption>
          <thead>
            <tr>
              <th scope="col">Report</th>
              <th scope="col">Time Range</th>
              <th scope="col">Download</th>
              <th scope="col">Update Frequency</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Users per country</td>
              <td>30 minutes</td>
              <td>
                <a
                  href={hrefBase + "/top-countries-realtime.json"}
                  className="download-data usa-button"
                  aria-label="top-countries-realtime.json"
                >
                  JSON
                </a>
                <a
                  href={hrefBase + "/top-countries-realtime.csv"}
                  className="download-data usa-button"
                  aria-label="top-countries-realtime.csv"
                >
                  CSV
                </a>
              </td>
              <td>Every 30 minutes</td>
            </tr>
            <tr>
              <td>Users per city</td>
              <td>30 minutes</td>
              <td>
                <a
                  href={hrefBase + "/top-cities-realtime.json"}
                  className="download-data usa-button"
                  aria-label="top-cities-realtime.json"
                >
                  JSON
                </a>
                <a
                  href={hrefBase + "/top-cities-realtime.csv"}
                  className="download-data usa-button"
                  aria-label="top-cities-realtime.csv"
                >
                  CSV
                </a>
              </td>
              <td>Every 30 minutes</td>
            </tr>
            <tr>
              <td>Language</td>
              <td>90 days</td>
              <td>
                <a
                  href={hrefBase + "/language.json"}
                  className="download-data usa-button"
                  aria-label="language.json"
                >
                  JSON
                </a>
                <a
                  href={hrefBase + "/language.csv"}
                  className="download-data usa-button"
                  aria-label="language.csv"
                >
                  CSV
                </a>
              </td>
              <td>Daily</td>
            </tr>
            <tr>
              <td>Desktop, mobile, tablet</td>
              <td>90 days</td>
              <td>
                <a
                  href={hrefBase + "/devices-90-days.json"}
                  className="download-data usa-button"
                  aria-label="devices.json"
                >
                  JSON
                </a>
                <a
                  href={hrefBase + "/devices-90-days.csv"}
                  className="download-data usa-button"
                  aria-label="devices.csv"
                >
                  CSV
                </a>
              </td>
              <td>Daily</td>
            </tr>
            <tr>
              <td>Web Browsers (90 days)</td>
              <td>90 days</td>
              <td>
                <a
                  href={hrefBase + "/browsers-90-days.json"}
                  className="download-data usa-button"
                  aria-label="browsers.json"
                >
                  JSON
                </a>
                <a
                  href={hrefBase + "/browsers-90-days.csv"}
                  className="download-data usa-button"
                  aria-label="browsers.csv"
                >
                  CSV
                </a>
              </td>
              <td>Daily</td>
            </tr>
            <tr>
              <td>Operating systems</td>
              <td>90 days</td>
              <td>
                <a
                  href={hrefBase + "/os-90-days.json"}
                  className="download-data usa-button"
                  aria-label="os.json"
                >
                  JSON
                </a>
                <a
                  href={hrefBase + "/os-90-days.csv"}
                  className="download-data usa-button"
                  aria-label="os.csv"
                >
                  CSV
                </a>
              </td>
              <td>Daily</td>
            </tr>
            <tr>
              <td>Versions of Windows</td>
              <td>90 days</td>
              <td>
                <a
                  href={hrefBase + "/windows-90-days.json"}
                  className="download-data usa-button"
                  aria-label="windows.json"
                >
                  JSON
                </a>
                <a
                  href={hrefBase + "/windows-90-days.csv"}
                  className="download-data usa-button"
                  aria-label="windows.csv"
                >
                  CSV
                </a>
              </td>
              <td>Daily</td>
            </tr>
            <tr>
              <td>OS &amp; browser (combined)</td>
              <td>90 days</td>
              <td>
                <a
                  href={hrefBase + "/os-browsers.json"}
                  className="download-data usa-button"
                  aria-label="os-browsers.json"
                >
                  JSON
                </a>
                <a
                  href={hrefBase + "/os-browsers.csv"}
                  className="download-data usa-button"
                  aria-label="os-browsers.csv"
                >
                  CSV
                </a>
              </td>
              <td>Daily</td>
            </tr>
            <tr>
              <td>Windows &amp; browser (combined)</td>
              <td>90 days</td>
              <td>
                <a
                  href={hrefBase + "/windows-browsers.json"}
                  className="download-data usa-button"
                  aria-label="windows-browsers.json"
                >
                  JSON
                </a>
                <a
                  href={hrefBase + "/windows-browsers.csv"}
                  className="download-data usa-button"
                  aria-label="windows-browsers.csv"
                >
                  CSV
                </a>
              </td>
              <td>Daily</td>
            </tr>
            <tr>
              <td>Screen sizes</td>
              <td>90 days</td>
              <td>
                <a
                  href={hrefBase + "/screen-size.json"}
                  className="download-data usa-button"
                  aria-label="screen-size.json"
                >
                  JSON
                </a>
                <a
                  href={hrefBase + "/screen-size.csv"}
                  className="download-data usa-button"
                  aria-label="screen-size.csv"
                >
                  CSV
                </a>
              </td>
              <td>Daily</td>
            </tr>
            <tr>
              <td>Device model</td>
              <td>90 days</td>
              <td>
                <a
                  href={hrefBase + "/device_model.json"}
                  className="download-data usa-button"
                  aria-label="device_model.json"
                >
                  JSON
                </a>
                <a
                  href={hrefBase + "/device_model.csv"}
                  className="download-data usa-button"
                  aria-label="device_model.csv"
                >
                  CSV
                </a>
              </td>
              <td>Daily</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

DataDownloads.propTypes = {
  dataURL: PropTypes.string.isRequired,
  dataPrefix: PropTypes.string.isRequired,
};

export default DataDownloads;
