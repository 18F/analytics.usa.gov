import React from "react";
import { render } from "@testing-library/react";
import d3 from "d3";
import TopSourceMedia from "../TopSourceMedia";

jest.mock("d3", () => ({
  ...jest.requireActual("d3"),
  json: jest.fn(),
}));

describe("TopSourceMedia", () => {
  let component;
  let data;

  describe("when data is not loaded", () => {
    beforeEach(() => {
      component = render(
        <TopSourceMedia dataHrefBase="http://www.example.com/data/" />,
      );
    });

    it("renders a component in loading state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe("when data is loaded", () => {
    beforeEach(() => {
      data = {
        name: "top-session-source-medium-30-days",
        query: {},
        meta: {
          name: "Top Session Sources (30 Days)",
          description:
            "Top 20 sources that initiated a session for the last 30 days, measured by visits, for all sites.",
        },
        totals: {
          visits: 1484625337,
          by_session_source_medium: {
            "google / organic": 704457119,
            "(direct) / (none)": 660705226,
            "bing / organic": 48783844,
            "google / cpc": 22696936,
            "yahoo / organic": 10122957,
            "(not set)": 9795115,
            "duckduckgo / organic": 5995170,
            "other / email": 4844244,
            "govdelivery / email": 4158644,
            "expected / email": 2215943,
            "outfordelivery / email": 1920103,
            "bing / cpc": 1261349,
            "google_dv360 / cpc": 1250907,
            "IDme / web": 1240864,
            "baidu / organic": 1191790,
            "delivered / email": 991532,
            "feature / email": 896141,
            "facebook / social": 838767,
            "ecosia.org / organic": 644408,
            "mcp / email": 614278,
          },
        },
        taken_at: "2024-03-11T17:08:18.756Z",
      };

      d3.json.mockImplementation((url, callback) => {
        callback(null, data);
      });
      component = render(
        <TopSourceMedia dataHrefBase="http://www.example.com/data/" />,
      );
    });

    it("renders a component with data loaded", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe("when data loading has an error", () => {
    beforeEach(async () => {
      d3.json.mockImplementation((url, callback) => {
        callback(new Error("you broke it"), null);
      });
      component = render(
        <TopSourceMedia dataHrefBase="http://www.example.com/data/" />,
      );
    });

    it("renders a component in error state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
