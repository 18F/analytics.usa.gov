import { render } from "@testing-library/react";
import d3 from "d3";
import TopChannels from "../TopChannels";

jest.mock("d3", () => ({
  ...jest.requireActual("d3"),
  json: jest.fn(),
}));

describe("TopChannels", () => {
  let component;
  let data;

  describe("when data is not loaded", () => {
    beforeEach(() => {
      component = render(
        <TopChannels dataHrefBase="http://www.example.com/data/" />,
      );
    });

    it("renders a component in loading state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe("when data is loaded", () => {
    beforeEach(() => {
      data = {
        name: "top-session-channel-group-30-days",
        query: {},
        meta: {
          name: "Top Session Default Channel Groups (30 Days)",
          description:
            "Top 20 channel groups that initiated a session for the last 30 days, measured by visits, for all sites.",
        },
        totals: {
          visits: 1498979124,
          by_session_default_channel_group: {
            "Organic Search": 771408816,
            Direct: 654428093,
            "Paid Search": 24004462,
            Email: 23132436,
            Unassigned: 17458658,
            "Paid Other": 1887150,
            "Organic Social": 1746765,
            "Paid Social": 1613780,
            Display: 1411481,
            Referral: 551772,
            SMS: 487414,
            "(other)": 455305,
            "Paid Video": 170270,
            "Organic Video": 115162,
            "Organic Shopping": 99087,
            Audio: 4828,
            "Mobile Push Notifications": 2366,
            Affiliates: 692,
            "Paid Shopping": 587,
          },
        },
        taken_at: "2024-03-11T14:12:05.867Z",
      };

      d3.json.mockImplementation((url, callback) => {
        callback(null, data);
      });
      component = render(
        <TopChannels dataHrefBase="http://www.example.com/data/" />,
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
        <TopChannels dataHrefBase="http://www.example.com/data/" />,
      );
    });

    it("renders a component in error state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
