import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CardGroup from "../CardGroup";

describe("CardGroup", () => {
  describe("when the component has children", () => {
    beforeEach(async () => {
      await render(
        <CardGroup id="foobar-id" className="foobar-class">
          <button>child button</button>
        </CardGroup>,
      );
      await waitFor(() => screen.getByRole("list"));
    });

    it("renders the children", () => {
      expect(
        screen.getByRole("button", { name: "child button" }),
      ).toBeInTheDocument();
    });

    it("has the passed id on the rendered element", () => {
      expect(screen.getByRole("list")).toHaveAttribute("id", "foobar-id");
    });

    it("has the passed class name on the rendered element", () => {
      expect(screen.getByRole("list")).toHaveAttribute(
        "class",
        "usa-card-group foobar-class",
      );
    });
  });

  describe("when the component does not have children", () => {
    describe("and the component has no id or class name", () => {
      beforeEach(async () => {
        await render(<CardGroup />);
        await waitFor(() => screen.getByRole("list"));
      });

      it("has no id", () => {
        expect(screen.getByRole("list")).not.toHaveAttribute("id");
      });

      it("has only the default class name", () => {
        expect(screen.getByRole("list")).toHaveAttribute(
          "class",
          "usa-card-group ",
        );
      });
    });

    describe("and the component has an id and className props", () => {
      beforeEach(async () => {
        await render(<CardGroup id="foobar-id" className="foobar-class" />);
        await waitFor(() => screen.getByRole("list"));
      });

      it("has the passed id on the rendered element", () => {
        expect(screen.getByRole("list")).toHaveAttribute("id", "foobar-id");
      });

      it("has the passed class name on the rendered element", () => {
        expect(screen.getByRole("list")).toHaveAttribute(
          "class",
          "usa-card-group foobar-class",
        );
      });
    });
  });
});
