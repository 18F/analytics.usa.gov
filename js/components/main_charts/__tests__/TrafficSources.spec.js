import React from "react";
import { render, screen, waitFor } from "@testing-library/react";

import TrafficSources from "../TrafficSources";

describe("TrafficSources", () => {
  let component;

  beforeEach(async () => {
    component = render(
      <TrafficSources dataHrefBase="http://www.example.com/data/" />,
    );
    await waitFor(() => screen.getByText("Top Channels"));
  });

  it("renders", () => {
    expect(component.asFragment()).toMatchSnapshot();
  });
});
