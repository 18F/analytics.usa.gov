import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import { delay } from "../../../../spec/support/test_utilities";
import DataLoader from "../../../lib/data_loader";
import TopPagesCircleGraph from "../TopPagesCircleGraph";

jest.mock("../../../lib/data_loader", () => ({
  ...jest.requireActual("../../../lib/data_loader"),
  loadJSON: jest.fn(),
}));

describe("TopPagesCircleGraph", () => {
  const data = {
    name: "top-pages-by-active-user-7-days",
    data: [
      { domain: "irs.gov", pagePath: "/", activeUsers: "100" },
      { domain: "irs.gov", pagePath: "/refunds", activeUsers: "50" },
      { domain: "ssa.gov", pagePath: "/", activeUsers: "80" },
      { domain: "weather.gov", pagePath: "/", activeUsers: "30" },
    ],
    totals: {},
    taken_at: "2024-03-11T13:59:19.359Z",
  };

  beforeEach(async () => {
    DataLoader.loadJSON.mockClear();
    DataLoader.loadJSON.mockImplementation(() => {
      return Promise.resolve(data);
    });
    render(
      <TopPagesCircleGraph dataHrefBase="http://www.example.com/data/live" />,
    );
    await waitFor(() => screen.getByText("irs.gov"));
    // Allow time for any follow-up reloads triggered by filter state changes
    // after the initial render to fire.
    await delay(300);
  });

  it("loads the default report only once on initial render", () => {
    expect(DataLoader.loadJSON).toHaveBeenCalledTimes(1);
    expect(DataLoader.loadJSON).toHaveBeenCalledWith(
      "http://www.example.com/data/live/top-pages-by-active-user-7-days.json",
    );
  });

  it("renders every hostname from the first load", () => {
    expect(screen.getByText("irs.gov")).toBeInTheDocument();
    expect(screen.getByText("ssa.gov")).toBeInTheDocument();
    expect(screen.getByText("weather.gov")).toBeInTheDocument();
  });
});
