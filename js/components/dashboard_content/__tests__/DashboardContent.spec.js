import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import DashboardContent from "../DashboardContent";

describe("MainCharts", () => {
  beforeEach(async () => {
    render(
      <DashboardContent
        dataURL="http://www.example.com"
        dataPrefix="interior"
        agency="Department of Interior"
      />,
    );
    await waitFor(() => screen.getByText("NaN"));
  });

  // Check for some subcomponents' text to ensure everything renders
  it("renders", () => {
    expect(screen.getByText("Operating Systems"));
    expect(screen.getByText("Top 30 Web Pages and App Screens"));
    expect(screen.getByText("Languages"));
    expect(screen.getByText("Top Channels"));
  });
});
