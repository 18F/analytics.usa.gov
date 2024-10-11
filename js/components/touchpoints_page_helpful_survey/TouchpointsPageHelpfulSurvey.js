import { useEffect, React } from "react";

/**
 * Creates the site TouchpointsPageHelpfulSurvey. Loads the JS code provided by
 * Touchpoints after the component is loaded. This Touchpoints code creates the
 * remainder of the survey form elements.
 *
 * @returns {import('react').ReactElement} The rendered element
 */
function TouchpointsPageHelpfulSurvey() {
  const initialFormDelayMilliseconds = 8000;

  useEffect(() => {
    document.addEventListener("onTouchpointsFormLoaded", (e) => {
      if (
        e.detail &&
        e.detail.formComponent
          .formComponent()
          .getAttribute("data-touchpoints-form-id") === "8fc3c209"
      ) {
        /**
         * Set an initial timeout for the form. If the form is submitted too
         * quickly (because it's a bot), then sendFeedback is a no-op
         */
        const originalSendFeedbackFunction =
          e.detail.formComponent.sendFeedback;
        /* eslint-disable no-empty */
        e.detail.formComponent.sendFeedback = () => {};
        /* eslint-enable no-empty */

        setTimeout(() => {
          e.detail.formComponent.sendFeedback = originalSendFeedbackFunction;
        }, initialFormDelayMilliseconds);

        const touchpointsFooter = e.detail.formComponent
          .formComponent()
          .querySelector("footer.touchpoints-footer-banner");
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

        // Hide the touchpoints footer always
        if (touchpointsFooter) {
          touchpointsFooter.classList.add("hide");
        }

        // Hide the second question and submit button initially
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
    require("../../lib/touchpoints_page_helpful_survey");
  });

  return (
    <>
      <div id="touchpoints-yes-no-form"></div>
    </>
  );
}

TouchpointsPageHelpfulSurvey.propTypes = {};

export default TouchpointsPageHelpfulSurvey;
