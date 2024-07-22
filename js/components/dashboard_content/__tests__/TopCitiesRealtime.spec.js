import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import { delay } from "../../../../spec/support/test_utilities";
import DataLoader from "../../../lib/data_loader";
import TopCitiesRealtime from "../TopCitiesRealtime";

jest.mock("../../../lib/data_loader", () => ({
  ...jest.requireActual("../../../lib/data_loader"),
  loadJSON: jest.fn(),
}));

describe("TopCitiesRealtime", () => {
  let component;
  let data;

  describe("when data is not loaded", () => {
    beforeEach(() => {
      DataLoader.loadJSON.mockImplementation(() => {
        return Promise.resolve(null);
      });
      component = render(
        <TopCitiesRealtime
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
        name: "top-cities-realtime",
        query: {},
        meta: {
          name: "Top Cities (Live)",
          description: "Top cities for active onsite users.",
        },
        data: [
          {
            city: "New York",
            active_visitors: "31565",
          },
          {
            city: "Chicago",
            active_visitors: "22808",
          },
          {
            city: "Atlanta",
            active_visitors: "14612",
          },
          {
            city: "Dallas",
            active_visitors: "14457",
          },
          {
            city: "Ashburn",
            active_visitors: "13372",
          },
          {
            city: "Los Angeles",
            active_visitors: "10543",
          },
          {
            city: "Washington",
            active_visitors: "10367",
          },
          {
            city: "Houston",
            active_visitors: "8454",
          },
          {
            city: "Seattle",
            active_visitors: "8418",
          },
          {
            city: "San Jose",
            active_visitors: "5897",
          },
          {
            city: "Boston",
            active_visitors: "5807",
          },
          {
            city: "Miami",
            active_visitors: "5524",
          },
          {
            city: "Reston",
            active_visitors: "5511",
          },
          {
            city: "Philadelphia",
            active_visitors: "5327",
          },
        ],
        totals: {},
        taken_at: "2024-01-05T16:05:48.568Z",
      };

      DataLoader.loadJSON.mockImplementation(() => {
        return Promise.resolve(data);
      });
      component = render(
        <TopCitiesRealtime
          dataHrefBase="http://www.example.com/data/"
          refreshSeconds={30}
        />,
      );
      await waitFor(() => screen.getByText("Washington"));
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
        <TopCitiesRealtime
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
