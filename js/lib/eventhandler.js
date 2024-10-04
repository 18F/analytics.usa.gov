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
    // Adds event handlers for the "Was this page helpful?" form
    if (
      e.detail &&
      e.detail.formComponent
        .formComponent()
        .getAttribute("data-touchpoints-form-id") === "8fc3c209"
    ) {
      const yesButton = e.detail.formComponent
        .formComponent()
        .querySelector('input.usa-radio__input[value="Yes"]');
      const noButton = e.detail.formComponent
        .formComponent()
        .querySelector('input.usa-radio__input[value="No"]');
      const questions = e.detail.formComponent
        .formComponent()
        .querySelectorAll(".questions .question");
      const header = e.detail.formComponent
        .formComponent()
        .querySelector("header");
      const submitButton = e.detail.formComponent
        .formComponent()
        .querySelector('button.submit_form_button[type="submit"]');

      if (questions.length > 0 && submitButton) {
        questions[1].classList.add("hide");
        submitButton.classList.add("hide");
      }

      const handleYesNoButtonClick = (clickEvent, response) => {
        if (questions.length > 0 && header && submitButton) {
          // Hide the first form question and the header. Show the second along
          // with the submit button.
          questions[0].classList.add("hide");
          header.classList.add("hide");
          questions[1].classList.remove("hide");
          submitButton.classList.remove("hide");
        }

        // Send metrics for the yes/no button click
        gas4("was_this_helpful_submit", {
          event_category: "cx_feedback",
          event_action: "was_this_page_helpful_v2.0",
          event_label: response,
        });
      };

      if (yesButton) {
        yesButton.addEventListener("click", (event) => {
          handleYesNoButtonClick(event, "yes");
        });
      }

      if (noButton) {
        noButton.addEventListener("click", (event) => {
          handleYesNoButtonClick(event, "no");
        });
      }
    }
  });
}
