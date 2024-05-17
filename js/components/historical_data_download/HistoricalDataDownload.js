import React, { useState } from "react";
import PropTypes from "prop-types";
import { isFuture, parse } from "date-fns";
import { mkConfig, generateCsv } from "export-to-csv";
import DapApiService from "../../lib/dap_api_service";

/**
 * Adds a form for downloading a month of historical data from the DAP API
 * using the API service. The form displays a loading spinner while the API
 * call(s) are in progress. The form provides options for all available reports
 * and agencies. It also provides options for all months and years 2018-2024.
 * The component provides validation that options are chosen and not in the
 * future; it displays an alert for validation errors. The component also
 * displays a message about rate limiting if an error occurs in the API call(s).
 *
 * @param {String} apiURL the URL of the API to access the data to be
 * downloaded.
 * @param {String} mainAgencyName the option name to display for the default
 * option in the select.
 * @param {String} agencies a JSON string of an array of objects with slug
 * and name keys. 'slug' is the API name for the agency, and 'name' is the
 * display name for the option.
 */
function HistoricalDataDownloads({ apiURL, mainAgencyName, agencies }) {
  const dapApiService = new DapApiService(apiURL);
  const parsedAgencies = JSON.parse(agencies);

  const [report, setReport] = useState("");
  const [agency, setAgency] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  /**
   * Handle form submit. Performs validation on the provided form fields. If the
   * fields are valid, uses the DAP API service to retrieve data for the
   * requested month. If errors or form validation issues occur, displays
   * helpful messages to the user.
   *
   * @param {Event} e the form submit event.
   */
  function handleSubmit(e) {
    e.preventDefault();
    const reportFormat = e.nativeEvent.submitter.value.toLowerCase();
    setError(false);

    if (hasInvalidInputs()) {
      setValidationMessage(
        "Report, month, and year are required fields. Please select values.",
      );
      setInvalid(true);
      return;
    } else if (dateIsInTheFuture()) {
      setValidationMessage(
        "Please select a month and year which is not in the future.",
      );
      setInvalid(true);
      return;
    } else {
      setInvalid(false);
      setValidationMessage("");
    }

    setLoading(true);
    return dapApiService
      .getReportForMonth(report, agency, month, year)
      .then((responseJSON) => {
        const data = formatResponseData(responseJSON, reportFormat);
        const contentHeader =
          reportFormat === "json" ? "application/json" : "text/csv";
        const fileName = `${report}-${month}-${year}.${reportFormat}`;

        triggerBrowserDownload(data, contentHeader, fileName);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  /**
   * @returns false if report, month, and year do not have valid values. This
   * also handles if the select was set to a valid value and then cleared, as
   * the state value is set to 'true' in that case
   */
  function hasInvalidInputs() {
    if (!(report && month && year)) {
      return true;
    }

    const reportValid =
      (typeof report === "string" || report instanceof String) &&
      report !== "true";
    const monthValid =
      (typeof month === "string" || month instanceof String) && !isNaN(month);
    const yearValid =
      (typeof year === "string" || year instanceof String) && !isNaN(year);
    return !(reportValid && monthValid && yearValid);
  }

  function dateIsInTheFuture() {
    const startOfMonth = parse(`${year}-${month}-01`, "yyyy-M-dd", new Date());
    return isFuture(startOfMonth);
  }

  /**
   * Transforms the API response body into a JSON or CSV string.
   *
   * @param {Object[]} data the JSON array of objects to be transformed
   * @param {String} format the format to transform the data into (JSON or CSV)
   * @returns {String} the data in stringified JSON or CSV format
   */
  function formatResponseData(data, format) {
    if (format === "json") {
      return JSON.stringify(data);
    } else {
      return generateCsv(mkConfig({ useKeysAsHeaders: true }))(data);
    }
  }

  /**
   * Downloads a data file to the user's browser.
   *
   * Creates a hidden anchor tag element on the page with the data, content
   * type, and file name as attributes on the element. Then, triggers a click
   * event on the element and removes the element from the page.
   *
   * @param {String} data the formatted data to download
   * @param {String} contentHeader the HTTP content type of the data
   * @param {String} fileName the file name to download in the user's browser
   */
  function triggerBrowserDownload(data, contentHeader, fileName) {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:${contentHeader};charset=utf-8,${encodeURIComponent(data)}`,
    );
    element.setAttribute("download", fileName);
    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  /**
   * Renders the full page including form elements for the API parameters. The
   * report options are hard coded to the list of reports in the DAP API docs.
   * The year options are hard coded to the years that the DAP API has been
   * recording Universal Analytics data.
   */
  return (
    <>
      <section class="historical-analytics-data">
        <div class="historical-analytics-data__header grid-row">
          <div class="desktop:grid-col-8">
            <h2>Download DAP Universal Analytics historical data</h2>
            <h4>
              <svg
                class="usa-icon"
                aria-hidden="false"
                focusable="false"
                role="img"
              >
                <use xlinkHref="/assets/uswds/img/sprite.svg#warning"></use>
              </svg>
              <span>About the data</span>
            </h4>
            <p>
              These Universal Analytics historical reports represent only
              summary-level web traffic and user demographic data aggregated by
              month and calendar year between January 1, 2018 and July 31, 2024.
              The data is limited to DAP-participating, public-facing federal
              government websites at the time of the original data collection.
              The number of websites participating in DAP was increasing during
              those years, so the yearly analysis represents a different sample
              size of participating websites.
            </p>
            <p>
              This directional information should only be used for general
              insights into online visitor behavior trends.
            </p>
            <h4>
              <svg
                class="usa-icon"
                aria-hidden="false"
                focusable="false"
                role="img"
              >
                <use xlinkHref="/assets/uswds/img/sprite.svg#warning"></use>
              </svg>
              <span>A note on sampling</span>
            </h4>
            <p>
              Due to varying Google Analytics API sampling thresholds, and the
              sheer volume of data in the Digital Analytics Program Universal
              Analytics property, reports may be subject to sampling. The data
              are intended to represent trends and numbers may not be precise.
            </p>
          </div>
        </div>

        <div class="historical-analytics-data__form grid-row">
          <div class="grid-col-12">
            <form onSubmit={(e) => handleSubmit(e)}>
              <legend class="form-control usa-legend usa-legend--large">
                Download data by month
              </legend>
              {error && (
                <div class="grid-row">
                  <div class="grid-col-12">
                    <div class="usa-alert usa-alert--error" role="alert">
                      <div class="usa-alert__body">
                        <h4 class="usa-alert__heading">
                          Error retrieving data
                        </h4>
                        <p class="usa-alert__text">
                          Could not retrieve the requested data. DAP APIs are
                          subject to rate limiting. Please try again later.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {invalid && (
                <div class="grid-row">
                  <div class="grid-col-12">
                    <div class="usa-alert usa-alert--error" role="alert">
                      <div class="usa-alert__body">
                        <h4 class="usa-alert__heading">Input error</h4>
                        <p class="usa-alert__text">{validationMessage}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <fieldset class="usa-fieldset">
                <div class="grid-row">
                  <div class="form-control grid-col-12 tablet:grid-col-8 desktop:grid-col-2">
                    <label class="usa-label" for="report">
                      Report
                      <abbr
                        title="required"
                        class="form-control usa-hint usa-hint--required"
                      >
                        *
                      </abbr>
                    </label>
                    <select
                      id="report"
                      name="report"
                      class="usa-select"
                      value={report}
                      onChange={(e) => setReport(e.target.value)}
                      required
                    >
                      <option value>- Select a report -</option>
                      <option value="domain">Visits to all domains</option>
                      <option value="second-level-domain">
                        Visits to second-level domains
                      </option>
                      <option value="download">Top downloads</option>
                      <option value="traffic-source">
                        Top traffic sources
                      </option>
                      <option value="language">Browser language</option>
                      <option value="device">
                        Device type (Desktop/Mobile/Tablet)
                      </option>
                      <option value="device-model">Device model</option>
                      <option value="os">Operating system</option>
                      <option value="os-browser">
                        Operating system and browser
                      </option>
                      <option value="windows">Windows version</option>
                      <option value="windows-browser">
                        Windows version and browser
                      </option>
                    </select>
                  </div>
                  <div class="form-control grid-col-12 tablet:grid-col-8 desktop:grid-col-2">
                    <label class="usa-label" for="agency">
                      Agency
                    </label>
                    <select
                      id="agency"
                      name="agency"
                      class="usa-select"
                      value={agency}
                      onChange={(e) => setAgency(e.target.value)}
                    >
                      {[
                        { slug: "", name: mainAgencyName },
                        ...parsedAgencies,
                      ].map((agency) => (
                        <option value={agency.slug}>{agency.name}</option>
                      ))}
                    </select>
                  </div>
                  <div class="form-control grid-col-12 tablet:grid-col-8 desktop:grid-col-2">
                    <label class="usa-label" for="month">
                      Month
                      <abbr
                        title="required"
                        class="form-control usa-hint usa-hint--required"
                      >
                        *
                      </abbr>
                    </label>
                    <select
                      id="month"
                      name="month"
                      class="usa-select"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      required
                    >
                      <option value>- Select a month -</option>
                      <option value="1">January</option>
                      <option value="2">February</option>
                      <option value="3">March</option>
                      <option value="4">April</option>
                      <option value="5">May</option>
                      <option value="6">June</option>
                      <option value="7">July</option>
                      <option value="8">August</option>
                      <option value="9">September</option>
                      <option value="10">October</option>
                      <option value="11">November</option>
                      <option value="12">December</option>
                    </select>
                  </div>
                  <div class="form-control grid-col-12 tablet:grid-col-8 desktop:grid-col-2">
                    <label class="usa-label" for="year">
                      Year
                      <abbr
                        title="required"
                        class="form-control usa-hint usa-hint--required"
                      >
                        *
                      </abbr>
                    </label>
                    <select
                      id="year"
                      name="year"
                      class="usa-select"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      required
                    >
                      <option value>- Select a year -</option>
                      <option value="2018">2018</option>
                      <option value="2019">2019</option>
                      <option value="2020">2020</option>
                      <option value="2021">2021</option>
                      <option value="2022">2022</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                    </select>
                  </div>
                  <div class="form-control grid-col-12 tablet:grid-col-8 desktop:grid-col-3">
                    <label class="usa-label">Download</label>
                    <div class="submit-buttons">
                      <input class="usa-button" type="submit" value="CSV" />
                      <input class="usa-button" type="submit" value="JSON" />
                    </div>
                  </div>
                  {loading && (
                    <div class="grid-col-12 tablet:grid-col-8 desktop:grid-col-1">
                      <div class="loading-spinner-container">
                        <div
                          class="loading-spinner"
                          role="alert"
                          aria-live="assertive"
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

HistoricalDataDownloads.propTypes = {
  apiURL: PropTypes.string.isRequired,
};

export default HistoricalDataDownloads;
