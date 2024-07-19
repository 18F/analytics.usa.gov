/**
 * Handles loading JSON data from remote sources
 */
class DataLoader {
  /**
   * Uses the browser fetch method to make calls to the provided URL to retrieve
   * JSON data.
   *
   * @param {string} url The URL for which to fetch data.
   * @returns {Promise<*>} the response body from the URL parsed to JSON.
   */
  static loadJSON(url) {
    if (!url) {
      return Promise.reject("Invalid URL");
    }

    return DataLoader.#getJSON(url);
  }

  static async #getJSON(url) {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "error",
    });
    const json = await response.json();

    return json;
  }
}

export default DataLoader;
