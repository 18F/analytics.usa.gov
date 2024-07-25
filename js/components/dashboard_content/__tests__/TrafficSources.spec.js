import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import { delay } from "../../../../spec/support/test_utilities";
import TrafficSources from "../TrafficSources";

describe("TrafficSources", () => {
  let component;

  beforeEach(async () => {
    component = render(
      <TrafficSources dataHrefBase="http://www.example.com/data/" />,
    );
    await waitFor(() => screen.getByText("Top Channels"));
    // Wait for barchart transition animation to complete (200 ms, set in
    // js/lib/chart_helpers/barchart.js)
    await delay(300);
  });

  it("renders", () => {
    expect(component.asFragment()).toMatchSnapshot();
  });
});
