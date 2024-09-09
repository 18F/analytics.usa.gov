import { useEffect, React } from "react";
//import PropTypes from "prop-types";

/**
 * Creates the site TouchpointsPageHelpfulSurvey. Loads the JS code provided by
 * Touchpoints after the component is loaded. This Touchpoints code creates the
 * remainder of the survey form elements.
 *
 * @returns {import('react').ReactElement} The rendered element
 */
function TouchpointsPageHelpfulSurvey() {
  useEffect(() => {
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
