import React from "react";
import { render } from "@testing-library/react";
import d3 from "d3";
import EngagementRate from "../EngagementRate";

jest.mock("d3", () => ({
  ...jest.requireActual("d3"),
  json: jest.fn(),
}));

describe("EngagementRate", () => {
  let component;
  let data;

  describe("when data is not loaded", () => {
    beforeEach(() => {
      component = render(
        <EngagementRate dataHrefBase="http://www.example.com/data/" />,
      );
    });

    it("renders a component in loading state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe("when data is loaded", () => {
    beforeEach(() => {
      data = {
        name: "engagement-rate",
        query: {
          metrics: [
            {
              name: "engagementRate",
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
          name: "Engagement rate (30 Days)",
          description:
            "Percent of sessions where the user was engaged over the past 30 days.",
        },
        data: [
          {
            engagementRate: "0.567412736435461",
          },
        ],
        totals: {},
        taken_at: "2024-03-20T02:14:07.426Z",
      };

      d3.json.mockImplementation((url, callback) => {
        callback(null, data);
      });
      component = render(
        <EngagementRate dataHrefBase="http://www.example.com/data/" />,
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
        <EngagementRate dataHrefBase="http://www.example.com/data/" />,
      );
    });

    it("renders a component in error state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
