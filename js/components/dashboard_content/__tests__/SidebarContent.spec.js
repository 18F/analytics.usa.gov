import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import SidebarContent from "../SidebarContent";

describe("SidebarContent", () => {
  beforeEach(async () => {
    render(
      <SidebarContent
        dataHrefBase="http://www.example.com/data/"
        agency="Department of Interior"
      />,
    );
    await waitFor(() => screen.getByText("30 Minutes"));
  });

  // Check for some subcomponents' text to ensure everything renders
  it("renders", () => {
    expect(screen.getByText("Top Web Pages and App Screens"));
    expect(screen.getByText("Top Downloads"));
    expect(screen.getByText("Top Video Plays"));
  });
});
