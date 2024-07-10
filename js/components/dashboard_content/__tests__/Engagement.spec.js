import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Engagement from "../Engagement";

describe("Engagement", () => {
  let component;

  beforeEach(async () => {
    component = await render(
      <Engagement dataHrefBase="http://www.example.com/data/" />,
    );
    await waitFor(() => screen.getByText("Percent of Engaged Sessions"));
  });

  it("renders", () => {
    expect(component.asFragment()).toMatchSnapshot();
  });
});
