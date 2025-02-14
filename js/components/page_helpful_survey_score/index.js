import React from "react";
import { createRoot } from "react-dom/client";
import PageHelpfulSurveyScore from "./PageHelpfulSurveyScore";

/**
 * Renders an PageHelpfulSurveyScore React component, when there is an
 * element on the current page with id 'page-helpful-survey-score-root'.
 *
 * The PageHelpfulSurveyScore component will be rendered as a child to the
 * matching element.
 */

const domNode = document.getElementById("page-helpful-survey-score-root");

if (domNode) {
  const root = createRoot(domNode);
  const dataURL = domNode.attributes.getNamedItem("dataurl").value;
  root.render(<PageHelpfulSurveyScore dataURL={dataURL} />);
}
