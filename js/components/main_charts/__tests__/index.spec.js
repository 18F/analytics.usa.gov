import { act } from "react";

describe("MainCharts root", () => {
  const dataPrefix = "";
  const dataURL = "https://www.example.com";
  const agency = "Department of Interior";
  let container;

  beforeEach(() => {
    delete require.cache["../index.js"];
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("when an element with id: main-charts-root is present", () => {
    beforeEach(() => {
      container = document.createElement("div");
      container.id = "main-charts-root";
      container.setAttribute("dataprefix", dataPrefix);
      container.setAttribute("agency", agency);
      container.setAttribute("dataurl", dataURL);
      document.body.appendChild(container);
      act(() => require("../index.js"));
    });

    it("should render", () => {
      // Check that the top level element of the component exists
      expect(document.getElementById("main_data")).not.toBeNull();
    });
  });

  describe("when an element with id: main-charts-root is not present", () => {
    beforeEach(() => {
      container = document.createElement("div");
      container.id = "foobar";
      container.setAttribute("dataprefix", dataPrefix);
      container.setAttribute("agency", agency);
      container.setAttribute("dataurl", dataURL);
      document.body.appendChild(container);
      act(() => require("../index.js"));
    });

    it("should not render", () => {
      expect(document.getElementById("main_data")).toBeNull();
    });
  });
});
