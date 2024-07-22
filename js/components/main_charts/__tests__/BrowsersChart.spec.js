import React from "react";
import { render } from "@testing-library/react";
import d3 from "d3";
import BrowsersChart from "../BrowsersChart";

jest.mock("d3", () => ({
  ...jest.requireActual("d3"),
  json: jest.fn(),
}));

describe("BrowsersChart", () => {
  let component;
  let data;

  describe("when data is not loaded", () => {
    beforeEach(() => {
      component = render(
        <BrowsersChart dataHrefBase="http://www.example.com/data/" />,
      );
    });

    it("renders a component in loading state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe("when data is loaded", () => {
    beforeEach(() => {
      data = {
        name: "browsers",
        query: {},
        meta: {
          name: "Browsers",
          description:
            "30 days of visits broken down by browser for all sites. (>100 sessions)",
        },
        totals: {
          visits: 1492721065,
          by_browser: {
            Chrome: 724669791,
            Safari: 532418559,
            Edge: 131456418,
            "Safari (in-app)": 28370663,
            Firefox: 28673898,
            "(other)": 542273,
            "Samsung Internet": 21535617,
            "Android Webview": 14658083,
            Opera: 3256137,
            "Amazon Silk": 2018466,
            "(not set)": 1299162,
            "Mozilla Compatible Agent": 882647,
            YaBrowser: 499856,
            "Internet Explorer": 1883528,
            "Whale Browser": 123256,
            "Coc Coc": 56684,
            "UC Browser": 119932,
            "Opera Mini": 49514,
            "Aloha Browser": 26440,
            Vivaldi: 14972,
            Mozilla: 27911,
            "Android Runtime": 22723,
            "Android Browser": 9271,
            "DuckDuckGo Browser": 13066,
            PaleMoon: 12977,
            "Meta Quest Browser": 8586,
            "Phoenix Browser": 8795,
            SeaMonkey: 9990,
            Lynx: 38014,
            Waterfox: 2841,
            Iron: 9347,
            Seznam: 1204,
            Puffin: 444,
          },
        },
        taken_at: "2024-03-11T13:59:19.359Z",
      };

      d3.json.mockImplementation((url, callback) => {
        callback(null, data);
      });
      component = render(
        <BrowsersChart dataHrefBase="http://www.example.com/data/" />,
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
        <BrowsersChart dataHrefBase="http://www.example.com/data/" />,
      );
    });

    it("renders a component in error state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
