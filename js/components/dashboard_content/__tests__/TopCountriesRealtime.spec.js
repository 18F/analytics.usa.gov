import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import { delay } from "../../../../spec/support/test_utilities";
import DataLoader from "../../../lib/data_loader";
import TopCountriesRealtime from "../TopCountriesRealtime";

jest.mock("../../../lib/data_loader", () => ({
  ...jest.requireActual("../../../lib/data_loader"),
  loadJSON: jest.fn(),
}));

describe("TopCountriesRealtime", () => {
  let component;
  let data;

  describe("when data is not loaded", () => {
    beforeEach(() => {
      DataLoader.loadJSON.mockImplementation(() => {
        return Promise.resolve(null);
      });
      component = render(
        <TopCountriesRealtime
          dataHrefBase="http://www.example.com/data/"
          refreshSeconds={30}
        />,
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
            active_visitors: "10002",
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

      DataLoader.loadJSON.mockImplementation(() => {
        return Promise.resolve(data);
      });
      component = render(
        <TopCountriesRealtime
          dataHrefBase="http://www.example.com/data/"
          refreshSeconds={30}
        />,
      );
      await waitFor(() => screen.getByText("Spain"));
      // Wait for barchart transition animation to complete (200 ms, set in
      // js/lib/chart_helpers/barchart.js)
      await delay(300);
    });

    it("renders a component with data loaded", async () => {
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
        <TopCountriesRealtime
          dataHrefBase="http://www.example.com/data/"
          refreshSeconds={30}
        />,
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
