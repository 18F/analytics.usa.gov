import React from "react";
import { render } from "@testing-library/react";
import d3 from "d3";
import RealtimeVisitors from "../RealtimeVisitors";

jest.mock("d3", () => ({
  ...jest.requireActual("d3"),
  json: jest.fn(),
}));

describe("RealtimeVisitors", () => {
  let component;
  let data;

  describe("when data is not loaded", () => {
    beforeEach(() => {
      component = render(
        <RealtimeVisitors
          dataHrefBase="http://www.example.com/data/"
          agency="Department of Defense"
        />,
      );
    });

    it("renders a component in loading state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe("when data is loaded", () => {
    beforeEach(() => {
      data = {
        name: "realtime",
        query: {
          metrics: [
            {
              name: "activeUsers",
            },
          ],
          samplingLevel: "HIGHER_PRECISION",
          limit: "10000",
          property: "properties/393249053",
        },
        meta: {
          name: "Active Users Right Now",
          description: "Number of users currently visiting all sites.",
        },
        data: [
          {
            active_visitors: "10003538",
          },
        ],
        totals: {},
        taken_at: "2024-01-05T16:05:45.980Z",
      };

      d3.json.mockImplementation((url, callback) => {
        callback(null, data);
      });
      component = render(
        <RealtimeVisitors
          dataHrefBase="http://www.example.com/data/"
          agency="Department of Defense"
        />,
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
        <RealtimeVisitors
          dataHrefBase="http://www.example.com/data/"
          agency="Department of Defense"
        />,
      );
    });

    it("renders a component in error state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
