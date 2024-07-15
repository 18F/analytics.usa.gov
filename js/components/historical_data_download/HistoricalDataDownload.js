import React, { useState } from "react";
import PropTypes from "prop-types";
import { isFuture, parse } from "date-fns";
import { mkConfig, generateCsv } from "export-to-csv";
import DapApiService from "../../lib/dap_api_service";
import DapApiDataFormatter from "../../lib/dap_api_data_formatter";

/**
 * Adds a form for downloading a month of historical data from the DAP API
 * using the API service. The form displays a loading spinner while the API
 * call(s) are in progress. The form provides options for all available reports
 * and agencies. It also provides options for all months and years 2018-2024.
 * The component provides validation that options are chosen and not in the
 * future; it displays an alert for validation errors. The component also
 * displays a message about rate limiting if an error occurs in the API call(s).
 *
 * @param {object} props the properties for the component
 * @param {string} props.apiURL the URL of the API to access the data to be
 * downloaded.
 * @param {string} props.mainAgencyName the option name to display for the default
 * option in the select.
 * @param {string} props.agencies a JSON string of an array of objects with
 * slug, name, and api_v1 keys. 'slug' is the API name for the agency, 'name' is
 * the display name for the option, and 'api_v1' is true if the agency is valid
 * for the DAP API version 1.
 * @returns {import('react').ReactElement} The rendered element
 */
function HistoricalDataDownloads({ apiURL, mainAgencyName, agencies }) {
  const parsedAgencies = JSON.parse(agencies)
    .filter(({ api_v1 }) => {
      return api_v1 === true;
    })
    .map(({ name, slug }) => {
      return { name, value: slug };
    });
  const apiReports = [
    {
      value: "domain",
      name: "Visits to participating hostnames",
    },
    {
      value: "download",
      name: "Top downloads",
    },
    {
      value: "traffic-source",
      name: "Top traffic sources",
    },
    {
      value: "language",
      name: "Browser language",
    },
    {
      value: "device",
      name: "Device type (Desktop/Mobile/Tablet)",
    },
    {
      value: "device-model",
      name: "Device model",
    },
    {
      value: "os",
      name: "Operating system",
    },
    {
      value: "os-browser",
      name: "Operating system and browser",
    },
    {
      value: "windows",
      name: "Windows version",
    },
    {
      value: "windows-browser",
      name: "Windows version and browser",
    },
  ];
  const dapApiService = new DapApiService(apiURL);
  const dapApiDataFormatter = new DapApiDataFormatter(
    apiReports,
    parsedAgencies,
  );

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
   * @param {object} e the form submit event.
   * @returns {Promise} resolves when the action completes. This may be
   * validation message set, or API call made and data download completion.
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
      .catch((e) => {
        console.log(e);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  /**
   * @returns {boolean} false if report, month, and year do not have valid
   * values. This also handles if the select was set to a valid value and then
   * cleared, as the state value is set to 'true' in that case
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
   * @param {object[]} data the JSON array of objects to be transformed
   * @param {string} format the format to transform the data into (JSON or CSV)
   * @returns {string} the data in stringified JSON or CSV format
   */
  function formatResponseData(data, format) {
    const mappedData = dapApiDataFormatter.mapForDisplay(data);

    if (format === "json") {
      return JSON.stringify(mappedData);
    } else {
      return generateCsv(mkConfig({ useKeysAsHeaders: true }))(mappedData);
    }
  }

  /**
   * Downloads a data file to the user's browser.
   *
   * Creates a hidden anchor tag element on the page with the data, content
   * type, and file name as attributes on the element. Then, triggers a click
   * event on the element and removes the element from the page.
   *
   * @param {string} data the formatted data to download
   * @param {string} contentHeader the HTTP content type of the data
   * @param {string} fileName the file name to download in the user's browser
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

  return (
    <>
      <section className="historical-analytics-data">
        <div className="historical-analytics-data__header grid-row">
          <div className="desktop:grid-col-8">
            <h1>Download Universal Analytics historical data</h1>
            <h2>
              <svg
                className="usa-icon"
                aria-hidden="true"
                focusable="false"
                role="img"
              >
                <use xlinkHref="/assets/uswds/img/sprite.svg#warning"></use>
              </svg>
              <span>About the data</span>
            </h2>
            <p>
              These Universal Analytics historical reports represent only
              summary-level web traffic and user demographic data aggregated by
              month and calendar year between January 1, 2018 and June 24, 2024.
              The data is limited to DAP-participating, public-facing federal
              government websites at the time of the original data collection.
              The number of websites participating in DAP was increasing during
              those years, so the yearly analysis represents a different sample
              size of participating websites.
            </p>
            <p>
              Due to varying Google Analytics API sampling thresholds, and the
              sheer volume of data in the Digital Analytics Program Universal
              Analytics property, reports are subject to sampling. The data are
              intended to represent trends and numbers may not be precise.
            </p>
            <p>
              <b>
                <i>
                  This directional information should only be used for general
                  insights into online visitor behavior trends.
                </i>
              </b>
            </p>
          </div>
        </div>

        <div className="historical-analytics-data__form grid-row">
          <div className="grid-col-12">
            <form onSubmit={(e) => handleSubmit(e)}>
              <fieldset className="usa-fieldset">
                <legend className="form-control usa-legend">
                  Download data by month
                </legend>
                {error && (
                  <div className="grid-row">
                    <div className="grid-col-12">
                      <div className="usa-alert usa-alert--error" role="alert">
                        <div className="usa-alert__body">
                          <h4 className="usa-alert__heading">
                            Error retrieving data
                          </h4>
                          <p className="usa-alert__text">
                            Could not retrieve the requested data. DAP APIs are
                            subject to rate limiting. Please try again later.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {invalid && (
                  <div className="grid-row">
                    <div className="grid-col-12">
                      <div className="usa-alert usa-alert--error" role="alert">
                        <div className="usa-alert__body">
                          <h4 className="usa-alert__heading">Input error</h4>
                          <p className="usa-alert__text">{validationMessage}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid-row">
                  <div className="form-control grid-col-12 tablet:grid-col-8 desktop:grid-col-2">
                    <label className="usa-label" htmlFor="report">
                      Report
                      <abbr
                        title="required"
                        className="form-control usa-hint usa-hint--required"
                      >
                        *
                      </abbr>
                    </label>
                    <select
                      id="report"
                      name="report"
                      className="usa-select"
                      value={report}
                      onChange={(e) => setReport(e.target.value)}
                      required
                    >
                      <option value>- Select a report -</option>
                      {apiReports.map((report) => (
                        <option key={report.value} value={report.value}>
                          {report.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-control grid-col-12 tablet:grid-col-8 desktop:grid-col-2">
                    <label className="usa-label" htmlFor="agency">
                      Agency
                    </label>
                    <select
                      id="agency"
                      name="agency"
                      className="usa-select"
                      value={agency}
                      onChange={(e) => setAgency(e.target.value)}
                    >
                      {[
                        { value: "", name: mainAgencyName },
                        ...parsedAgencies,
                      ].map((agency) => (
                        <option key={agency.value} value={agency.value}>
                          {agency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-control grid-col-12 tablet:grid-col-8 desktop:grid-col-2">
                    <label className="usa-label" htmlFor="month">
                      Month
                      <abbr
                        title="required"
                        className="form-control usa-hint usa-hint--required"
                      >
                        *
                      </abbr>
                    </label>
                    <select
                      id="month"
                      name="month"
                      className="usa-select"
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
                  <div className="form-control grid-col-12 tablet:grid-col-8 desktop:grid-col-2">
                    <label className="usa-label" htmlFor="year">
                      Year
                      <abbr
                        title="required"
                        className="form-control usa-hint usa-hint--required"
                      >
                        *
                      </abbr>
                    </label>
                    <select
                      id="year"
                      name="year"
                      className="usa-select"
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
                  <div className="form-control grid-col-12 tablet:grid-col-8 desktop:grid-col-3">
                    <label className="usa-label">Download</label>
                    <div className="submit-buttons">
                      <input className="usa-button" type="submit" value="CSV" />
                      <input
                        className="usa-button"
                        type="submit"
                        value="JSON"
                      />
                    </div>
                  </div>
                  {loading && (
                    <div className="grid-col-12 tablet:grid-col-8 desktop:grid-col-1">
                      <div className="loading-spinner-container">
                        <div
                          className="loading-spinner"
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
  mainAgencyName: PropTypes.string.isRequired,
  agencies: PropTypes.string.isRequired,
};

export default HistoricalDataDownloads;
