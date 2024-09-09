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

  document.addEventListener("onTouchpointsFormLoaded", (e) => {
    // Adds event handlers for a specific form: 9ae710d3
    if (
      e.detail &&
      e.detail.formComponent
        .formComponent()
        .getAttribute("data-touchpoints-form-id") === "9ae710d3"
    ) {
      const yesButton = e.detail.formComponent
        .formComponent()
        .querySelector('input.usa-button[value="yes"]');
      const noButton = e.detail.formComponent
        .formComponent()
        .querySelector('input.usa-button[value="no"]');

      yesButton.addEventListener("click", (event) => {
        event.preventDefault();
        gas4("was_this_helpful_submit", {
          event_category: "cx_feedback",
          event_action: "was_this_page_helpful2",
          event_label: "yes",
        });
      });

      noButton.addEventListener("click", (event) => {
        event.preventDefault();
        gas4("was_this_helpful_submit", {
          event_category: "cx_feedback",
          event_action: "was_this_page_helpful2",
          event_label: "no",
        });
      });
    }
  });
}
