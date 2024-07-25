/**
 * Provides application level config values for javascript.
 */
class Config {
  /**
   * @returns {number} the number of seconds to wait before refreshing realtime
   * data and re-rendering realtime charts.
   */
  static get realtimeDataRefreshSeconds() {
    return 180;
  }

  /**
   * @returns {number} the number of milliseconds for bar charts to animate the
   * bars from 0 to the final width of the bar.
   */
  static get barchartTransitionDurationMs() {
    return 200;
  }
}

export default Config;
