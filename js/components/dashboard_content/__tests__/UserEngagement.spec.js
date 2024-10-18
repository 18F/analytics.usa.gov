import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import UserEngagement from "../UserEngagement";

describe("UserEngagement", () => {
  let component;

  beforeEach(async () => {
    component = await render(
      <UserEngagement dataHrefBase="http://www.example.com/data/" />,
    );
    await waitFor(() => screen.getByText("Percent of Engaged Sessions"));
  });

  it("renders", () => {
    expect(component.asFragment()).toMatchSnapshot();
  });
});
