import React from "react";
import { createRoot } from "react-dom/client";
import TouchpointsPageHelpfulSurvey from "./TouchpointsPageHelpfulSurvey";

/**
 * Renders an TouchpointsPageHelpfulSurvey React component, when there is an
 * element on the current page with id 'touchpoints-page-helpful-survey-root'.
 *
 * The TouchpointsPageHelpfulSurvey component will be rendered as a child to the
 * matching element.
 */

const domNode = document.getElementById("touchpoints-page-helpful-survey-root");

if (domNode) {
  const root = createRoot(domNode);
  root.render(<TouchpointsPageHelpfulSurvey />);
}
