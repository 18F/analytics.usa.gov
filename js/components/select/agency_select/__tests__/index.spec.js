import { act } from "react";

describe("AgencySelect root", () => {
  const pathSuffix = "/data";
  const mainAgencyName = "live";
  const agencies = '[{"slug": "interior", "name": "Department of Interior"}]';
  let container;

  beforeEach(() => {
    delete require.cache["../index.js"];
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("when an element with id: analytics-agency-select-root is present", () => {
    beforeEach(() => {
      container = document.createElement("div");
      container.id = "analytics-agency-select-root";
      container.setAttribute("pathsuffix", pathSuffix);
      container.setAttribute("mainagencyname", mainAgencyName);
      container.setAttribute("agencies", agencies);
      document.body.appendChild(container);
      act(() => require("../index.js"));
    });

    it("should render", () => {
      // Check that the top level element of the component exists
      expect(document.getElementsByClassName("usa-select").length).toBe(1);
    });
  });

  describe("when an element with id: analytics-agency-select-root is not present", () => {
    beforeEach(() => {
      container = document.createElement("div");
      container.id = "foobar";
      container.setAttribute("pathsuffix", pathSuffix);
      container.setAttribute("mainagencyname", mainAgencyName);
      container.setAttribute("agencies", agencies);
      document.body.appendChild(container);
      act(() => require("../index.js"));
    });

    it("should not render", () => {
      expect(document.getElementsByClassName("usa-select").length).toBe(0);
    });
  });
});
