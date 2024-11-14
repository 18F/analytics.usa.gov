import { act } from "react";

describe("Footer root", () => {
  const siteDomain = "http://www.example.com";
  let container;

  beforeEach(() => {
    delete require.cache["../index.js"];
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe("when an element with id: footer-root is present", () => {
    beforeEach(() => {
      container = document.createElement("div");
      container.id = "footer-root";
      container.setAttribute("sitedomain", siteDomain);
      document.body.appendChild(container);
      act(() => require("../index.js"));
    });

    it("should render", () => {
      // Check that the top level element of the component exists
      expect(document.getElementById("analytics-footer")).not.toBeNull();
    });
  });

  describe("when an element with id: footer-root is not present", () => {
    beforeEach(() => {
      container = document.createElement("div");
      container.id = "foobar";
      container.setAttribute("sitedomain", siteDomain);
      document.body.appendChild(container);
      act(() => require("../index.js"));
    });

    it("should not render", () => {
      expect(document.getElementById("analytics-footer")).toBeNull();
    });
  });
});
