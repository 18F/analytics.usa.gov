import { act } from "react";

describe("DataDownloads root", () => {
  const dataURL = "http://www.example.com";
  const dataPrefix = "foobar";
  let container;

  beforeEach(() => {
    delete require.cache["../index.js"];
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("when an element with id: data-downloads-root is present", () => {
    beforeEach(() => {
      container = document.createElement("div");
      container.id = "data-downloads-root";
      container.setAttribute("dataurl", dataURL);
      container.setAttribute("dataprefix", dataPrefix);
      document.body.appendChild(container);
      act(() => require("../index.js"));
    });

    it("should render", () => {
      // Check that the top level element of the component exists
      expect(
        document.getElementsByClassName(
          "analytics-data__sessions desktop:grid-col-12",
        ).length,
      ).toBe(1);
    });
  });

  describe("when an element with id: data-downloads-root is not present", () => {
    beforeEach(() => {
      container = document.createElement("div");
      container.id = "foobar";
      container.setAttribute("dataurl", dataURL);
      container.setAttribute("dataprefix", dataPrefix);
      document.body.appendChild(container);
      act(() => require("../index.js"));
    });

    it("should not render", () => {
      expect(
        document.getElementsByClassName(
          "analytics-data__sessions desktop:grid-col-12",
        ).length,
      ).toBe(0);
    });
  });
});
