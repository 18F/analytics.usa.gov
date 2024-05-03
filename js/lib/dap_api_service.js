import {
  isFuture,
  lastDayOfMonth,
  lightFormat,
  parse,
  startOfToday,
} from "date-fns";

/**
 * Handles interactions with the DAP API.
 */
class DapApiService {
  static #API_PAGE_LIMIT = 10000;
  #apiURL;

  /**
   * @param {String} apiURL the base route for the API
   */
  constructor(apiURL) {
    this.#apiURL = apiURL;
  }

  /**
   * Uses the browser fetch method to make calls to the DAP API to retrieve a
   * full month's worth of data for the report, month, and year provided.
   *
   * If an agency is provided, the report will be limited to the data for that
   * agency.  Otherwise, data for all DAP agencies will be returned.
   *
   * @param {String} report The report name. See the DAP API docs for the list
   * of report names.
   * @param {String} agency The agency name (optional). See the DAP API docs for
   * the list of agency names.
   * @param {String} month The month of data (expects the digit version without
   * leading zero).
   * @param {String} year The year of data (expects the 4 digit year).
   * @returns {Promise<Object[]>} an array of JSON objects with the report data.
   */
  getReportForMonth(report, agency, month, year) {
    if (!(report && month && year)) {
      return Promise.reject("Missing required params for report API call");
    }

    const reportURL = this.#buildMonthReportURL(report, agency, month, year);

    return this.#getAllPages(reportURL);
  }

  #buildMonthReportURL(report, agency, month, year) {
    let fullURL = this.#apiURL;
    const startDate = parse(`${year}-${month}-01`, "yyyy-M-dd", new Date());
    const startDateString = lightFormat(startDate, "yyyy-MM-dd");
    const endDateString = lightFormat(
      this.#lastDayOfMonthOrYesterday(startDate),
      "yyyy-MM-dd",
    );

    if (agency) {
      fullURL = `${fullURL}/agencies/${agency}`;
    }

    return `${fullURL}/reports/${report}/data?after=${startDateString}&before=${endDateString}`;
  }

  #lastDayOfMonthOrYesterday(date) {
    const endOfMonth = lastDayOfMonth(date);
    if (isFuture(endOfMonth)) {
      return startOfToday();
    } else {
      return endOfMonth;
    }
  }

  /**
   * Get pages of data from the API until an API call returns less items than
   * the limit of data items per call.
   *
   * @param {String} baseURL the API URL with query params.
   * @returns {Object[]} the full JSON array with pages of data combined.
   */
  async #getAllPages(baseURL) {
    const URL = `${baseURL}&limit=${DapApiService.#API_PAGE_LIMIT}`;
    let fullJsonArray = [];

    let page = 1;
    while (true) {
      const jsonArrayPage = await this.#getPage(URL, page);
      fullJsonArray = fullJsonArray.concat(jsonArrayPage);

      if (jsonArrayPage.length < DapApiService.#API_PAGE_LIMIT) {
        return fullJsonArray;
      }
      page++;
    }
  }

  async #getPage(baseURL, page) {
    const URL = `${baseURL}&page=${page}`;
    const response = await fetch(URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "error",
    });
    const json = await response.json();

    // Remove the API deprecation notice from each object in the array.
    return json.map(
      ({ notice, ...remainingAttributes }) => remainingAttributes,
    );
  }
}

export default DapApiService;
