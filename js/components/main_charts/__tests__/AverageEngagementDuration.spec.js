import React from "react";
import { render } from "@testing-library/react";
import d3 from "d3";
import AverageEngagementDuration from "../AverageEngagementDuration";

jest.mock("d3", () => ({
  ...jest.requireActual("d3"),
  json: jest.fn(),
}));

describe("AverageEngagementDuration", () => {
  let component;
  let data;

  describe("when data is not loaded", () => {
    beforeEach(() => {
      component = render(
        <AverageEngagementDuration dataHrefBase="http://www.example.com/data/" />,
      );
    });

    it("renders a component in loading state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe("when data is loaded", () => {
    beforeEach(() => {
      data = {
        name: "user-engagement-duration",
        query: {
          metrics: [
            {
              name: "userEngagementDuration",
            },
            {
              name: "sessions",
            },
          ],
          dateRanges: [
            {
              startDate: "30daysAgo",
              endDate: "yesterday",
            },
          ],
          limit: "10000",
          property: "properties/397708109",
        },
        meta: {
          name: "User engagement duration (30 Days)",
          description:
            "Top 20 sources that initiated a session for the last 30 days, measured by visits, for all sites.",
        },
        data: [
          {
            userEngagementDuration: "101105154773",
            visits: "1616841012",
          },
        ],
        totals: {
          visits: 1616841012,
        },
        taken_at: "2024-03-19T20:58:28.812Z",
      };

      d3.json.mockImplementation((url, callback) => {
        callback(null, data);
      });
      component = render(
        <AverageEngagementDuration dataHrefBase="http://www.example.com/data/" />,
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
        <AverageEngagementDuration dataHrefBase="http://www.example.com/data/" />,
      );
    });

    it("renders a component in error state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
