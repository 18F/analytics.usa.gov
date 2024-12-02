import React from "react";
import { render } from "@testing-library/react";
import TouchpointsPageHelpfulSurvey from "../TouchpointsPageHelpfulSurvey";

jest.mock("export-to-csv", () => {
  return {};
});

describe("TouchpointsPageHelpfulSurvey", () => {
  let component;

  describe("initial render", () => {
    beforeEach(() => {
      component = render(<TouchpointsPageHelpfulSurvey />);
    });

    it("renders the form", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
