import { act } from "react";

// This package causes syntax problems with jest for some reason. Mock it out as
// a workaround
jest.mock("export-to-csv", () => {
  return {};
});

fdescribe("HistoricalDataDownload root", () => {
  const apiURL = "http://www.example.com";
  const mainAgencyName = "live";
  const agencies = '[{"slug": "interior", "name": "Department of Interior"}]';
  let container;

  beforeEach(() => {
    delete require.cache["../index.js"];
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("when an element with id: historical-data-download-root is present", () => {
    beforeEach(() => {
      container = document.createElement("div");
      container.id = "historical-data-download-root";
      container.setAttribute("apiurl", apiURL);
      container.setAttribute("mainagencyname", mainAgencyName);
      container.setAttribute("agencies", agencies);
      document.body.appendChild(container);
      act(() => require("../index.js"));
    });

    it("should render", () => {
      // Check that the top level element of the component exists
      expect(
        document.getElementsByClassName("historical-analytics-data").length,
      ).toBe(1);
    });
  });

  describe("when an element with id: historical-data-download-root is not present", () => {
    beforeEach(() => {
      container = document.createElement("div");
      container.id = "foobar";
      container.setAttribute("apiurl", apiURL);
      container.setAttribute("mainagencyname", mainAgencyName);
      container.setAttribute("agencies", agencies);
      document.body.appendChild(container);
      act(() => require("../index.js"));
    });

    it("should not render", () => {
      expect(
        document.getElementsByClassName("historical-analytics-data").length,
      ).toBe(0);
    });
  });
});
