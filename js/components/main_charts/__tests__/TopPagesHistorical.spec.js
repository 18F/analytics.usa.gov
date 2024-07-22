import React from "react";
import { render } from "@testing-library/react";
import d3 from "d3";
import TopPagesHistorical from "../TopPagesHistorical";

jest.mock("d3", () => ({
  ...jest.requireActual("d3"),
  json: jest.fn(),
}));

describe("TopPagesHistorical", () => {
  let component;
  let data;

  describe("when data is not loaded", () => {
    beforeEach(() => {
      component = render(
        <TopPagesHistorical
          dataHrefBase="http://www.example.com/data/"
          reportFileName="foobar.json"
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
        name: "top-pages-30-days",
        query: {},
        meta: {
          name: "Top Pages (30 Days)",
          description:
            "Last 30 days' top 20 pages, measured by page views, for all sites.",
        },
        data: [
          {
            domain: "tools.usps.com",
            page: "tools.usps.com/go/TrackConfirmAction",
            page_title: "USPS.com® - USPS Tracking® Results",
            pageviews: "175651763",
            visits: "126859658",
            active_visitors: "41122748",
            pageviews_per_session: "1.3846148237290692",
            avg_session_duration: "171.74193047494396",
            bounce_rate: "0.516912713102222",
          },
          {
            domain: "tools.usps.com",
            page: "tools.usps.com/go/TrackConfirmAction_input",
            page_title: "USPS.com® - USPS Tracking® Results",
            pageviews: "172077548",
            visits: "137854682",
            active_visitors: "53726725",
            pageviews_per_session: "1.2482531931704721",
            avg_session_duration: "143.76776746692858",
            bounce_rate: "0.71359610404817442",
          },
          {
            domain: "www.time.gov",
            page: "www.time.gov/",
            page_title: "National Institute of Standards and Technology | NIST",
            pageviews: "84090552",
            visits: "1266571",
            active_visitors: "636538",
            pageviews_per_session: "66.392291470434742",
            avg_session_duration: "5480.046422452051",
            bounce_rate: "0.32670888564478423",
          },
          {
            domain: "time.gov",
            page: "time.gov/",
            page_title: "National Institute of Standards and Technology | NIST",
            pageviews: "72639584",
            visits: "670903",
            active_visitors: "288571",
            pageviews_per_session: "108.27136560724874",
            avg_session_duration: "8884.0348247349248",
            bounce_rate: "0.32556867386194427",
          },
          {
            domain: "informeddelivery.usps.com",
            page: "informeddelivery.usps.com/box/pages/secure/DashboardAction_input.action",
            page_title: "Informed Delivery",
            pageviews: "69452793",
            visits: "38515219",
            active_visitors: "7172331",
            pageviews_per_session: "1.8032558246650499",
            avg_session_duration: "139.83037450543193",
            bounce_rate: "0.065903896327319342",
          },
          {
            domain: "reg.usps.com",
            page: "reg.usps.com/entreg/LoginAction_input",
            page_title: "USPS.com® - Sign In",
            pageviews: "48787297",
            visits: "42294001",
            active_visitors: "19010794",
            pageviews_per_session: "1.1535275889363128",
            avg_session_duration: "65.027813792656616",
            bounce_rate: "0.25750216916105906",
          },
          {
            domain: "tools.usps.com",
            page: "tools.usps.com/go/TrackConfirmAction.action",
            page_title: "USPS.com® - USPS Tracking® Results",
            pageviews: "39112726",
            visits: "31254428",
            active_visitors: "13242495",
            pageviews_per_session: "1.2514298773920931",
            avg_session_duration: "137.3760588116821",
            bounce_rate: "0.67310251206645022",
          },
          {
            domain: "www.usps.com",
            page: "www.usps.com/",
            page_title: "Welcome | USPS",
            pageviews: "38337381",
            visits: "30140169",
            active_visitors: "16102673",
            pageviews_per_session: "1.27196967608244",
            avg_session_duration: "75.4410073226582",
            bounce_rate: "0.1505468665421219",
          },
          {
            domain: "www.usps.com",
            page: "www.usps.com/manage/informed-delivery.htm",
            page_title:
              "Informed Delivery - Mail & Package Notifications | USPS",
            pageviews: "35945379",
            visits: "32447672",
            active_visitors: "8288147",
            pageviews_per_session: "1.107795314252437",
            avg_session_duration: "45.984241744616888",
            bounce_rate: "0.072226013625877383",
          },
          {
            domain: "reg.usps.com",
            page: "reg.usps.com/portal/login",
            page_title: "USPS.com® - Sign In",
            pageviews: "30299198",
            visits: "27517507",
            active_visitors: "4890637",
            pageviews_per_session: "1.1010880091717612",
            avg_session_duration: "32.001429442707845",
            bounce_rate: "0.012020856395166903",
          },
        ],
        totals: {
          visits: 571051212,
        },
        taken_at: "2024-01-05T15:31:52.352Z",
      };

      d3.json.mockImplementation((url, callback) => {
        callback(null, data);
      });
      component = render(
        <TopPagesHistorical
          dataHrefBase="http://www.example.com/data/"
          reportFileName="foobar.json"
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
        <TopPagesHistorical
          dataHrefBase="http://www.example.com/data/"
          reportFileName="foobar.json"
        />,
      );
    });

    it("renders a component in error state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
