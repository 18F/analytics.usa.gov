import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import { delay } from "../../../../spec/support/test_utilities";
import DownloadReportFactory from "../../../../spec/factories/reports/download";
import VideoPlayReportFactory from "../../../../spec/factories/reports/video_play";
import DataLoader from "../../../lib/data_loader";
import TopDownloadsAndVideoPlays from "../TopDownloadsAndVideoPlays";

jest.mock("../../../lib/data_loader", () => ({
  ...jest.requireActual("../../../lib/data_loader"),
  loadJSON: jest.fn(),
}));

describe("TopDownloadsAndVideoPlays", () => {
  let component;

  describe("when data is not loaded", () => {
    beforeEach(() => {
      DataLoader.loadJSON.mockImplementation(() => {
        return Promise.resolve(null);
      });
      component = render(
        <TopDownloadsAndVideoPlays
          dataHrefBase="http://www.example.com/data/"
          agency="NASA"
          downloadsReportFileName="download-foobar.json"
          videoPlaysReportFileName="video-foobar.json"
          timeIntervalHeader="Last Week"
          timeIntervalDescription="over the last week"
        />,
      );
    });

    it("renders a component in loading state", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe("when data is loaded", () => {
    describe("and video play data is empty", () => {
      beforeEach(async () => {
        DataLoader.loadJSON.mockImplementation((url) => {
          if (url.includes("download-foobar.json")) {
            return Promise.resolve(
              DownloadReportFactory.build(
                {},
                { transient: { dataItemCount: 20 } },
              ),
            );
          } else {
            return Promise.resolve(
              VideoPlayReportFactory.build(
                {},
                { transient: { dataItemCount: 0 } },
              ),
            );
          }
        });
        component = render(
          <TopDownloadsAndVideoPlays
            dataHrefBase="http://www.example.com/data/"
            agency="NASA"
            downloadsReportFileName="download-foobar.json"
            videoPlaysReportFileName="video-foobar.json"
            timeIntervalHeader="Last Week"
            timeIntervalDescription="over the last week"
          />,
        );
        await waitFor(() => screen.getByText("Top 20 Downloads Last Week"));
        // Wait for barchart transition animation to complete (200 ms, set in
        // js/lib/chart_helpers/barchart.js)
        await delay(300);
      });

      it("renders a component with data loaded", () => {
        expect(component.asFragment()).toMatchSnapshot();
      });

      it("does not render video plays", () => {
        expect(
          screen.getAllByText("Video play data is unavailable", {
            exact: false,
          }),
        ).not.toBeNull();
      });
    });

    describe("and video play data has 2 results", () => {
      beforeEach(async () => {
        DataLoader.loadJSON.mockImplementation((url) => {
          if (url.includes("download-foobar.json")) {
            return Promise.resolve(
              DownloadReportFactory.build(
                {},
                { transient: { dataItemCount: 20 } },
              ),
            );
          } else {
            return Promise.resolve(
              VideoPlayReportFactory.build(
                {},
                { transient: { dataItemCount: 2 } },
              ),
            );
          }
        });
        component = render(
          <TopDownloadsAndVideoPlays
            dataHrefBase="http://www.example.com/data/"
            agency="NASA"
            downloadsReportFileName="download-foobar.json"
            videoPlaysReportFileName="video-foobar.json"
            timeIntervalHeader="Last Week"
            timeIntervalDescription="over the last week"
          />,
        );
        await waitFor(() => screen.getByText("Top 20 Downloads Last Week"));
        // Wait for barchart transition animation to complete (200 ms, set in
        // js/lib/chart_helpers/barchart.js)
        await delay(300);
      });

      it("renders a component with data loaded", () => {
        expect(component.asFragment()).toMatchSnapshot();
      });

      it("does not render video plays", () => {
        expect(
          screen.getAllByText("Video play data is unavailable", {
            exact: false,
          }),
        ).not.toBeNull();
      });
    });

    describe("and video play data has > 2 results", () => {
      beforeEach(async () => {
        DataLoader.loadJSON.mockImplementation((url) => {
          if (url.includes("download-foobar.json")) {
            return Promise.resolve(
              DownloadReportFactory.build(
                {},
                { transient: { dataItemCount: 20 } },
              ),
            );
          } else {
            return Promise.resolve(
              VideoPlayReportFactory.build(
                {},
                { transient: { dataItemCount: 20 } },
              ),
            );
          }
        });
        component = render(
          <TopDownloadsAndVideoPlays
            dataHrefBase="http://www.example.com/data/"
            agency="NASA"
            downloadsReportFileName="download-foobar.json"
            videoPlaysReportFileName="video-foobar.json"
            timeIntervalHeader="Last Week"
            timeIntervalDescription="over the last week"
          />,
        );
        await waitFor(() => screen.getByText("Top 10 Video Plays Last Week"));
        // Wait for barchart transition animation to complete (200 ms, set in
        // js/lib/chart_helpers/barchart.js)
        await delay(300);
      });

      it("renders a component with data loaded", () => {
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
        <TopDownloadsAndVideoPlays
          dataHrefBase="http://www.example.com/data/"
          agency="NASA"
          downloadsReportFileName="download-foobar.json"
          videoPlaysReportFileName="video-foobar.json"
          timeIntervalHeader="Last Week"
          timeIntervalDescription="over the last week"
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
