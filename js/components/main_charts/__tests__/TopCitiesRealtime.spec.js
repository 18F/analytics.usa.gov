import { render } from "@testing-library/react";
import d3 from "d3";
import TopCitiesRealtime from "../TopCitiesRealtime";

jest.mock("d3", () => ({
  ...jest.requireActual("d3"),
  json: jest.fn(),
}));

describe("TopCitiesRealtime", () => {
  let component;
  let data;

  describe("when data is not loaded", () => {
    beforeEach(() => {
      component = render(
        <TopCitiesRealtime dataHrefBase="http://www.example.com/data/" />,
      );
    });

    it("renders a component in loading state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe("when data is loaded", () => {
    beforeEach(() => {
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

      d3.json.mockImplementation((url, callback) => {
        callback(null, data);
      });
      component = render(
        <TopCitiesRealtime dataHrefBase="http://www.example.com/data/" />,
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
        <TopCitiesRealtime dataHrefBase="http://www.example.com/data/" />,
      );
    });

    it("renders a component in error state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
