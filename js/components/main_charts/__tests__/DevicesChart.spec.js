import React from "react";
import { render } from "@testing-library/react";
import d3 from "d3";
import DevicesChart from "../DevicesChart";

jest.mock("d3", () => ({
  ...jest.requireActual("d3"),
  json: jest.fn(),
}));

describe("DevicesChart", () => {
  let component;
  let data;

  describe("when data is not loaded", () => {
    beforeEach(() => {
      component = render(
        <DevicesChart dataHrefBase="http://www.example.com/data/" />,
      );
    });

    it("renders a component in loading state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe("when data is loaded", () => {
    beforeEach(() => {
      data = {
        name: "devices",
        query: {},
        meta: {
          name: "Devices",
          description: "30 days of desktop/mobile/tablet visits for all sites.",
        },
        totals: {
          visits: 1492377457,
          by_device: {
            mobile: 811958807,
            desktop: 656318825,
            "(other)": 1938220,
            tablet: 19920488,
            "smart tv": 2241117,
          },
        },
        taken_at: "2024-03-11T13:59:08.677Z",
      };

      d3.json.mockImplementation((url, callback) => {
        callback(null, data);
      });
      component = render(
        <DevicesChart dataHrefBase="http://www.example.com/data/" />,
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
        <DevicesChart dataHrefBase="http://www.example.com/data/" />,
      );
    });

    it("renders a component in error state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
