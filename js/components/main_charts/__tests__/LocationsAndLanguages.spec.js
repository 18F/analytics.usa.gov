import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import LocationsAndLanguages from "../LocationsAndLanguages";

describe("LocationsAndLanguages", () => {
  let component;

  beforeEach(async () => {
    component = render(
      <LocationsAndLanguages dataHrefBase="http://www.example.com/data/" />,
    );
    await waitFor(() => screen.getByText("Languages"));
  });

  it("renders", () => {
    expect(component.asFragment()).toMatchSnapshot();
  });
});
