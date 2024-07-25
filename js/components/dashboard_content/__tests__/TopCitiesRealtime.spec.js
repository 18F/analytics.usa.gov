import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import { delay } from "../../../../spec/support/test_utilities";
import DataLoader from "../../../lib/data_loader";
import TopCitiesRealtime from "../TopCitiesRealtime";
import CitiesReportFactory from "../../../../spec/factories/reports/cities";

jest.mock("../../../lib/data_loader", () => ({
  ...jest.requireActual("../../../lib/data_loader"),
  loadJSON: jest.fn(),
}));

describe("TopCitiesRealtime", () => {
  let component;

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
    const data = CitiesReportFactory.build();

    beforeEach(async () => {
      DataLoader.loadJSON.mockImplementation(() => {
        return Promise.resolve(data);
      });
      component = render(
        <TopCitiesRealtime
          dataHrefBase="http://www.example.com/data/"
          refreshSeconds={30}
        />,
      );
      await waitFor(() => screen.getByText(data.data[0].city));
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
