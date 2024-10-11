import d3 from "d3";

/**
 * Add event listeners to links and buttons to send Google Analytics events
 */
export default function () {
  document.addEventListener("DOMContentLoaded", () => {
    d3.selectAll(".download-data").on("click", function () {
      const link = this.href;
      const eventText = this.text;
      ga("send", "event", "Download Data", link, eventText);
    });

    d3.selectAll(".external-link").on("click", function () {
      const link = this.href;
      const eventText = this.text;
      ga("send", "event", "External Link", link, eventText);
    });

    d3.selectAll(".top-download-page").on("click", function () {
      const link = this.href;
      const eventText = this.text;
      ga("send", "event", "Top-Download Page", link, eventText);
    });

    d3.selectAll(".top-download-file").on("click", function () {
      const link = this.href;
      const eventText = this.text;
      ga("send", "event", "Top-Download File", link, eventText);
    });
  });
}
