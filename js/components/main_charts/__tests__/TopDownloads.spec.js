import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import DataLoader from "../../../lib/data_loader";
import TopDownloads from "../TopDownloads";

jest.mock("../../../lib/data_loader", () => ({
  ...jest.requireActual("../../../lib/data_loader"),
  loadJSON: jest.fn(),
}));

describe("TopDownloads", () => {
  let component;
  let data;

  describe("when data is not loaded", () => {
    beforeEach(() => {
      DataLoader.loadJSON.mockImplementation(() => {
        return Promise.resolve(null);
      });
      component = render(
        <TopDownloads
          dataHrefBase="http://www.example.com/data/"
          reportFileName="foobar.json"
          numberOfListingsToDisplay={20}
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
        name: "top-downloads-yesterday",
        query: {},
        meta: {
          name: "Top Downloads Yesterday",
          description: "Top downloads yesterday",
        },
        data: [
          {
            date: "2024-01-04",
            page_title:
              "Inactivated Influenza Vaccine Information Statement | CDC",
            event_label: "file_download",
            file_name:
              "https://www.cdc.gov/vaccines/hcp/vis/vis-statements/flu.pdf",
            page: "www.cdc.gov/vaccines/hcp/vis/vis-statements/flu.html",
            total_events: "30000000",
          },
          {
            date: "2024-01-04",
            page_title:
              "About Form W-9, Request for Taxpayer Identification Number and Certification | Internal Revenue Service",
            event_label: "file_download",
            file_name: "/pub/irs-pdf/fw9.pdf",
            page: "www.irs.gov/forms-pubs/about-form-w-9",
            total_events: "28634",
          },
          {
            date: "2024-01-04",
            page_title: "Small Entity Compliance Guide | FinCEN.gov",
            event_label: "file_download",
            file_name:
              "/sites/default/files/shared/boi_small_compliance_guide.v1.1-final.pdf",
            page: "www.fincen.gov/boi/small-entity-compliance-guide",
            total_events: "9426",
          },
          {
            date: "2024-01-04",
            page_title: "Passport Fees",
            event_label: "file_download",
            file_name:
              "/content/dam/passports/forms-fees/fee%20chart%202023.pdf",
            page: "travel.state.gov/content/travel/en/passports/how-apply/fees.html",
            total_events: "9295",
          },
          {
            date: "2024-01-04",
            page_title: "Employment Eligibility Verification | USCIS",
            event_label: "file_download",
            file_name: "/sites/default/files/document/forms/i-9.pdf",
            page: "www.uscis.gov/i-9",
            total_events: "8984",
          },
          {
            date: "2024-01-04",
            page_title: "General Schedule",
            event_label: "file_download",
            file_name:
              "/policy-data-oversight/pay-leave/salaries-wages/salary-tables/24tables/pdf/dcb.pdf",
            page: "www.opm.gov/policy-data-oversight/pay-leave/salaries-wages/2024/general-schedule",
            total_events: "8774",
          },
          {
            date: "2024-01-04",
            page_title: "General Schedule",
            event_label: "file_download",
            file_name:
              "/policy-data-oversight/pay-leave/salaries-wages/salary-tables/24tables/pdf/rus.pdf",
            page: "www.opm.gov/policy-data-oversight/pay-leave/salaries-wages/2024/general-schedule",
            total_events: "8174",
          },
          {
            date: "2024-01-04",
            page_title:
              "About Form W-4, Employee's Withholding Certificate | Internal Revenue Service",
            event_label: "file_download",
            file_name: "/pub/irs-pdf/fw4.pdf",
            page: "www.irs.gov/forms-pubs/about-form-w-4",
            total_events: "6385",
          },
        ],
        totals: {},
        taken_at: "2024-01-05T15:31:55.633Z",
      };

      DataLoader.loadJSON.mockImplementation(() => {
        return Promise.resolve(data);
      });
      component = render(
        <TopDownloads
          dataHrefBase="http://www.example.com/data/"
          reportFileName="foobar.json"
          numberOfListingsToDisplay={20}
        />,
      );
      await waitFor(() => screen.getByText("Passport Fees"));
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
        <TopDownloads
          dataHrefBase="http://www.example.com/data/"
          reportFileName="foobar.json"
          numberOfListingsToDisplay={20}
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
