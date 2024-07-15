import React from "react";
import { render } from "@testing-library/react";
import d3 from "d3";
import TopCountriesRealtime from "../TopCountriesRealtime";

jest.mock("d3", () => ({
  ...jest.requireActual("d3"),
  json: jest.fn(),
}));

describe("TopCountriesRealtime", () => {
  let component;
  let data;

  describe("when data is not loaded", () => {
    beforeEach(() => {
      component = render(
        <TopCountriesRealtime dataHrefBase="http://www.example.com/data/" />,
      );
    });

    it("renders a component in loading state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe("when data is loaded", () => {
    beforeEach(async () => {
      data = {
        name: "top-countries-realtime",
        query: {},
        meta: {
          name: "Top Countries",
          description: "Top countries for active onsite users.",
        },
        data: [
          {
            country: "United States",
            active_visitors: "803775",
          },
          {
            country: "India",
            active_visitors: "11231",
          },
          {
            country: "Canada",
            active_visitors: "8507",
          },
          {
            country: "United Kingdom",
            active_visitors: "8097",
          },
          {
            country: "Mexico",
            active_visitors: "7900",
          },
          {
            country: "Colombia",
            active_visitors: "3966",
          },
          {
            country: "Philippines",
            active_visitors: "3831",
          },
          {
            country: "Germany",
            active_visitors: "3163",
          },
          {
            country: "Puerto Rico",
            active_visitors: "2785",
          },
          {
            country: "France",
            active_visitors: "2453",
          },
          {
            country: "Spain",
            active_visitors: "2230",
          },
          {
            country: "Argentina",
            active_visitors: "1912",
          },
          {
            country: "Brazil",
            active_visitors: "1879",
          },
          {
            country: "Peru",
            active_visitors: "1579",
          },
          {
            country: "Pakistan",
            active_visitors: "1543",
          },
          {
            country: "Italy",
            active_visitors: "1527",
          },
          {
            country: "Chile",
            active_visitors: "1497",
          },
          {
            country: "Indonesia",
            active_visitors: "1392",
          },
        ],
        totals: {},
        taken_at: "2024-01-05T16:05:49.789Z",
      };

      d3.json.mockImplementation((url, callback) => {
        callback(null, data);
      });
      component = render(
        <TopCountriesRealtime dataHrefBase="http://www.example.com/data/" />,
      );
      // Delay so that the nested charts have time to render.
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(1000);
    });

    it("renders a component with data loaded", async () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe("when data loading has an error", () => {
    beforeEach(async () => {
      d3.json.mockImplementation((url, callback) => {
        callback(new Error("you broke it"), null);
      });
      component = render(
        <TopCountriesRealtime dataHrefBase="http://www.example.com/data/" />,
      );
    });

    it("renders a component in error state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
