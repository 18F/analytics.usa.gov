import { act } from "@testing-library/react";

describe("DashboardContent root", () => {
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

  describe("when an element with id: dashboard-content-root is present", () => {
    beforeEach(async () => {
      container = document.createElement("div");
      container.id = "dashboard-content-root";
      container.setAttribute("dataprefix", dataPrefix);
      container.setAttribute("agency", agency);
      container.setAttribute("dataurl", dataURL);
      document.body.appendChild(container);

      await act(async () => {
        require("../index.js");

        // Delay so that charts have time to render.
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await delay(500);
      });
    });

    it("should render", () => {
      // Check that the top level element of the component exists
      expect(document.getElementById("main_data")).not.toBeNull();
    });
  });

  describe("when an element with id: dashboard-content-root is not present", () => {
    beforeEach(async () => {
      container = document.createElement("div");
      container.id = "foobar";
      container.setAttribute("dataprefix", dataPrefix);
      container.setAttribute("agency", agency);
      container.setAttribute("dataurl", dataURL);
      document.body.appendChild(container);

      await act(async () => {
        require("../index.js");

        // Delay so that charts have time to render.
        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
        await delay(500);
      });
    });

    it("should not render", () => {
      expect(document.getElementById("main_data")).toBeNull();
    });
  });
});
