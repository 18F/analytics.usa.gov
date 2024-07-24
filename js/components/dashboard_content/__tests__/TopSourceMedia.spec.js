import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import { delay } from "../../../../spec/support/test_utilities";
import DataLoader from "../../../lib/data_loader";
import TopSourceMedia from "../TopSourceMedia";

jest.mock("../../../lib/data_loader", () => ({
  ...jest.requireActual("../../../lib/data_loader"),
  loadJSON: jest.fn(),
}));

describe("TopSourceMedia", () => {
  let component;
  let data;

  describe("when data is not loaded", () => {
    beforeEach(() => {
      DataLoader.loadJSON.mockImplementation(() => {
        return Promise.resolve(null);
      });
      component = render(
        <TopSourceMedia dataHrefBase="http://www.example.com/data/" />,
      );
    });

    it("renders a component in loading state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe("when data is loaded", () => {
    beforeEach(async () => {
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

      DataLoader.loadJSON.mockImplementation(() => {
        return Promise.resolve(data);
      });
      component = render(
        <TopSourceMedia dataHrefBase="http://www.example.com/data/" />,
      );
      await waitFor(() => screen.getByText("google / organic"));
      // Wait for barchart transition animation to complete (200 ms, set in
      // js/lib/chart_helpers/barchart.js)
      await delay(300);
    });

    it("renders a component with data loaded", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe("when data loading has an error", () => {
    const error = "you broke it";

    beforeEach(() => {
      console.error = jest.fn();
      DataLoader.loadJSON.mockImplementation(() => {
        return Promise.reject(error);
      });
      component = render(
        <TopSourceMedia dataHrefBase="http://www.example.com/data/" />,
      );
    });

    it("renders a component in error state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });

    it("logs the error to console", () => {
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });
});
