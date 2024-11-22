import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SidebarContent from "../SidebarContent";

describe("SidebarContent", () => {
  let component;

  describe("when 30 minutes tab is selected", () => {
    beforeEach(async () => {
      component = render(
        <SidebarContent
          dataHrefBase="http://www.example.com/data/"
          agency="Department of Interior"
        />,
      );
      await waitFor(() => screen.getByRole("generic", { name: "30 mins" }));
    });

    it("renders a component with top pages realtime, and top downloads yesterday", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe("when 7 days tab is selected", () => {
    beforeEach(async () => {
      const user = userEvent.setup();

      component = render(
        <SidebarContent
          dataHrefBase="http://www.example.com/data/"
          agency="Department of Interior"
        />,
      );
      await waitFor(() => screen.getByRole("generic", { name: "7 days" }));
      await user.click(screen.getByRole("generic", { name: "7 days" }));
    });

    it("renders a component with top pages for 7 days, and top downloads for 7 days", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });

  describe("when 30 days tab is selected", () => {
    beforeEach(async () => {
      const user = userEvent.setup();

      component = render(
        <SidebarContent
          dataHrefBase="http://www.example.com/data/"
          agency="Department of Interior"
        />,
      );
      await waitFor(() => screen.getByRole("generic", { name: "30 days" }));
      await user.click(screen.getByRole("generic", { name: "30 days" }));
    });

    it("renders a component with top pages for 30 days, and top downloads for 30 days", () => {
      expect(component.asFragment()).toMatchSnapshot();
    });
  });
});
