/**
 * Handles transforming / formatting DAP API data.
 */
class DapApiDataFormatter {
  #reports;
  #agencies;

  /**
   * @param {object[]} reports the report display names and API names for use in
   * mapping the API response report_name column. Expects name and value keys
   * where name is the display name, and value is the API value for the
   * report_name.
   * @param {object[]} agencies the agency display names and API names for use
   * in mapping the API response report_agency column. Expects name and value
   * keys where name is the display name, and value is the API value for the
   * report_agency.
   */
  constructor(reports = [{}], agencies = [{}]) {
    this.#reports = reports;
    this.#agencies = agencies;
  }

  /**
   * Removes notice and id keys.  Maps report_name and report_agency keys to the
   * display names provided in the constructor.
   *
   * @param {object[]} jsonArray the array to be mapped
   * @returns {object[]} JSON array with unneeded keys removed and report/agency
   * values mapped.
   */
  mapForDisplay(jsonArray) {
    if (jsonArray.length == 0) {
      return jsonArray;
    }

    const report = this.#reports.find((report) => {
      return report.value == jsonArray[0].report_name;
    });
    const agency = this.#agencies.find((agency) => {
      return agency.value == jsonArray[0].report_agency;
    });
    /* eslint-disable no-unused-vars */
    return jsonArray.map(
      ({ notice, id, report_name, report_agency, ...remainingAttributes }) => {
        // Pull out notice and id keys here, because we want them filtered.
        return {
          report_name: report ? report.name : report_name,
          report_agency: agency ? agency.name : report_agency,
          ...remainingAttributes,
        };
      },
    );
    /* eslint-disable no-unused-vars */
  }
}

export default DapApiDataFormatter;
