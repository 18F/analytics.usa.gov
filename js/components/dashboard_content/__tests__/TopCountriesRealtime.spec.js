import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import { delay } from "../../../../spec/support/test_utilities";
import DataLoader from "../../../lib/data_loader";
import TopCountriesRealtime from "../TopCountriesRealtime";
import CountriesReportFactory from "../../../../spec/factories/reports/countries";

jest.mock("../../../lib/data_loader", () => ({
  ...jest.requireActual("../../../lib/data_loader"),
  loadJSON: jest.fn(),
}));

describe("TopCountriesRealtime", () => {
  let component;

  describe("when data is not loaded", () => {
    beforeEach(() => {
      DataLoader.loadJSON.mockImplementation(() => {
        return Promise.resolve(null);
      });
      component = render(
        <TopCountriesRealtime
          dataHrefBase={"http://www.example.com/data/"}
          refreshSeconds={30}
        />,
      );
    });

    it("renders a component in loading state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe("when data is loaded", () => {
    let data;

    describe("and all country names are valid", () => {
      beforeEach(async () => {
        data = CountriesReportFactory.build();
        DataLoader.loadJSON.mockImplementation(() => {
          return Promise.resolve(data);
        });
        component = render(
          <TopCountriesRealtime
            dataHrefBase={"http://www.example.com/data/"}
            refreshSeconds={30}
          />,
        );
        await waitFor(() => screen.getByText(data.data[0].country));
        await waitFor(() => screen.getByText("International"));
        // Wait for barchart transition animation to complete (200 ms, set in
        // js/lib/chart_helpers/barchart.js)
        await delay(500);
      });

      it("renders a component with data loaded", async () => {
        expect(component.asFragment()).toMatchSnapshot();
      });
    });

    describe('and a country with name "" exists', () => {
      beforeEach(async () => {
        data = CountriesReportFactory.build();
        data.data[0].country = "";
        DataLoader.loadJSON.mockImplementation(() => {
          return Promise.resolve(data);
        });
        component = render(
          <TopCountriesRealtime
            dataHrefBase={"http://www.example.com/data/"}
            refreshSeconds={30}
          />,
        );
        await waitFor(() => screen.getByText(data.data[0].country));
        await waitFor(() => screen.getByText("International"));
        // Wait for barchart transition animation to complete (200 ms, set in
        // js/lib/chart_helpers/barchart.js)
        await delay(500);
      });

      it("renders a component with data loaded", async () => {
        expect(component.asFragment()).toMatchSnapshot();
      });
    });

    describe("and a country with name null exists", () => {
      beforeEach(async () => {
        data = CountriesReportFactory.build();
        data.data[0].country = null;
        DataLoader.loadJSON.mockImplementation(() => {
          return Promise.resolve(data);
        });
        component = render(
          <TopCountriesRealtime
            dataHrefBase={"http://www.example.com/data/"}
            refreshSeconds={30}
          />,
        );
        await waitFor(() => screen.getByText(data.data[0].country));
        await waitFor(() => screen.getByText("International"));
        // Wait for barchart transition animation to complete (200 ms, set in
        // js/lib/chart_helpers/barchart.js)
        await delay(500);
      });

      it("renders a component with data loaded", async () => {
        expect(component.asFragment()).toMatchSnapshot();
      });
    });

    describe("and a country with name undefined exists", () => {
      beforeEach(async () => {
        data = CountriesReportFactory.build();
        data.data[0].country = undefined;
        DataLoader.loadJSON.mockImplementation(() => {
          return Promise.resolve(data);
        });
        component = render(
          <TopCountriesRealtime
            dataHrefBase={"http://www.example.com/data/"}
            refreshSeconds={30}
          />,
        );
        await waitFor(() => screen.getByText(data.data[0].country));
        await waitFor(() => screen.getByText("International"));
        // Wait for barchart transition animation to complete (200 ms, set in
        // js/lib/chart_helpers/barchart.js)
        await delay(500);
      });

      it("renders a component with data loaded", async () => {
        expect(component.asFragment()).toMatchSnapshot();
      });
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
          dataHrefBase={"http://www.example.com/data/"}
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
