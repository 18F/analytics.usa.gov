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
        const formComponent = e.detail.formComponent;
        const formElement = formComponent.formComponent();
        _delayFormSubmit(formComponent, initialFormDelayMilliseconds);

        const touchpointsFooter = formElement.querySelector(
          "footer.touchpoints-footer-banner",
        );
        const yesButton = formElement.querySelector(
          'input.usa-radio__input[value="Yes"]',
        );
        const noButton = formElement.querySelector(
          'input.usa-radio__input[value="No"]',
        );
        const feedbackTextArea = formElement.querySelector("textarea");
        const questions = formElement.querySelectorAll(".questions .question");
        const header = formElement.querySelector("#fba-form-title-8fc3c209");
        const submitButton = formElement.querySelector(
          'button.submit_form_button[type="submit"]',
        );

        // Hide the touchpoints footer always
        if (touchpointsFooter) {
          touchpointsFooter.classList.add("hide");
        }

        // Hide the second question and submit button initially
        if (questions.length > 0 && submitButton) {
          questions[1].classList.add("hide");
          submitButton.classList.add("hide");
        }

        const handleYesNoButtonClick = () => {
          if (questions.length > 0 && header && submitButton) {
            // Hide the first form question and the header. Show the second along
            // with the submit button.
            questions[0].classList.add("hide");
            header.classList.add("hide");
            questions[1].classList.remove("hide");
            submitButton.classList.remove("hide");
          }
        };

        if (yesButton) {
          yesButton.addEventListener("click", handleYesNoButtonClick);
        }

        if (noButton) {
          noButton.addEventListener("click", handleYesNoButtonClick);
        }

        if (submitButton) {
          submitButton.addEventListener("click", () => {
            const eventDetails = {
              event_category: "cx_feedback",
              event_action: "was_this_page_helpful_v3.0",
            };

            if (feedbackTextArea.value) {
              eventDetails.reason = feedbackTextArea.value;
            }

            // Only send the event if the yes/no radio option has been set.
            if (yesButton.checked) {
              eventDetails.event_label = "yes";
              gas4("was_this_helpful_submit", eventDetails);
            } else if (noButton.checked) {
              eventDetails.event_label = "no";
              gas4("was_this_helpful_submit", eventDetails);
            }
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

function _delayFormSubmit(formComponent, delayMilliseconds) {
  /**
   * Set an initial timeout for the form. If the form is submitted too
   * quickly (because it's a bot), then sendFeedback is a no-op
   */
  const originalSendFeedbackFunction = formComponent.sendFeedback;
  /* eslint-disable no-empty */
  formComponent.sendFeedback = () => {};
  /* eslint-enable no-empty */

  setTimeout(() => {
    formComponent.sendFeedback = originalSendFeedbackFunction;
  }, delayMilliseconds);
}

TouchpointsPageHelpfulSurvey.propTypes = {};

export default TouchpointsPageHelpfulSurvey;
