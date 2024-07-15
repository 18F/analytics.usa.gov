import React from "react";
import { render } from "@testing-library/react";
import HistoricalDataDownload from "../HistoricalDataDownload";

jest.mock("export-to-csv", () => {
  return {};
});

describe("HistoricalDataDownload", () => {
  const apiURL = "http://www.example.com";
  const mainAgencyName = "foobar";
  const agencies =
    '[{"name":"Agency for International Development","slug":"agency-international-development","_name":"Agency for International Development", "api_v1":true},{"name":"Department of Commerce","slug":"commerce","_name":"Department of Commerce", "api_v1":false}]';
  let component;

  // TODO: Write tests around form submit behavior (validation, success/error
  // from API calls, loading, etc.) Currently this cannot be done because the
  // JSDOM onSubmit behavior doesn't work right. See issue here:
  // https://github.com/jsdom/jsdom/issues/3117
  describe("initial render", () => {
    beforeEach(() => {
      component = render(
        <HistoricalDataDownload
          apiURL={apiURL}
          mainAgencyName={mainAgencyName}
          agencies={agencies}
        />,
      );
    });

    it("renders the form with form fields set", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
