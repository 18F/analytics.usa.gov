import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import DeviceDemographics from "../DeviceDemographics";

describe("DeviceDemographics", () => {
  let component;

  beforeEach(async () => {
    component = await render(
      <DeviceDemographics dataHrefBase="http://www.example.com/data/" />,
    );
    await waitFor(() => screen.getByText("Web Browsers"));
  });

  it("renders", () => {
    expect(component.asFragment()).toMatchSnapshot();
  });
});
