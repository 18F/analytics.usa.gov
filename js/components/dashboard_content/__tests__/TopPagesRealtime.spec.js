import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import DataLoader from "../../../lib/data_loader";
import TopPagesRealtime from "../TopPagesRealtime";

jest.mock("../../../lib/data_loader", () => ({
  ...jest.requireActual("../../../lib/data_loader"),
  loadJSON: jest.fn(),
}));

describe("TopPagesRealtime", () => {
  let component;
  let data;

  describe("when data is not loaded", () => {
    beforeEach(() => {
      DataLoader.loadJSON.mockImplementation(() => {
        return Promise.resolve(null);
      });
      component = render(
        <TopPagesRealtime
          dataHrefBase="http://www.example.com/data/"
          reportFileName="foobar.json"
          numberOfListingsToDisplay={10}
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
        name: "top-pages-realtime",
        query: {},
        meta: {
          name: "Top Pages (Live)",
          description:
            "The top 20 pages, measured by active onsite users, for all sites.",
        },
        data: [
          {
            page_title: "National Institute of Standards and Technology | NIST",
            active_visitors: "7689",
          },
          {
            page_title: "USPS.com® - USPS Tracking® Results",
            active_visitors: "7657",
          },
          {
            page_title: "Federal Student Aid",
            active_visitors: "3576",
          },
          {
            page_title: "USAJOBS - Search",
            active_visitors: "2242",
          },
          {
            page_title: "USPS.com® - Sign In",
            active_visitors: "1452",
          },
          {
            page_title:
              "Search Public Sex Offender Registries | Dru Sjodin National Sex Offender Public Website",
            active_visitors: "1420",
          },
          {
            page_title: "Informed Delivery",
            active_visitors: "1347",
          },
          {
            page_title: "NWS Radar",
            active_visitors: "1266",
          },
          {
            page_title: "USAJOBS - Job Announcement",
            active_visitors: "1226",
          },
          {
            page_title:
              "Official ESTA Application Website, U.S. Customs and Border Protection",
            active_visitors: "928",
          },
          {
            page_title: "Social Security",
            active_visitors: "714",
          },
          {
            page_title: "Welcome | USPS",
            active_visitors: "629",
          },
          {
            page_title: "SAM.gov",
            active_visitors: "566",
          },
          {
            page_title: "SAM.gov | Search",
            active_visitors: "564",
          },
          {
            page_title: "Log In | Federal Student Aid",
            active_visitors: "500",
          },
          {
            page_title: "National Weather Service",
            active_visitors: "485",
          },
          {
            page_title: "USPS.com® - USPS Tracking®",
            active_visitors: "440",
          },
          {
            page_title: "FAFSA® Application | Federal Student Aid",
            active_visitors: "429",
          },
          {
            page_title: "Home - My HealtheVet - My HealtheVet",
            active_visitors: "400",
          },
          {
            page_title:
              "Home | Dru Sjodin National Sex Offender Public Website",
            active_visitors: "400",
          },
        ],
        totals: {},
        taken_at: "2024-01-05T16:05:47.043Z",
      };

      DataLoader.loadJSON.mockImplementation(() => {
        return Promise.resolve(data);
      });
      component = render(
        <TopPagesRealtime
          dataHrefBase="http://www.example.com/data/"
          reportFileName="foobar.json"
          numberOfListingsToDisplay={10}
          refreshSeconds={30}
        />,
      );
      await waitFor(() => screen.getByText("USAJOBS - Search"));
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
        <TopPagesRealtime
          dataHrefBase="http://www.example.com/data/"
          reportFileName="foobar.json"
          numberOfListingsToDisplay={10}
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
