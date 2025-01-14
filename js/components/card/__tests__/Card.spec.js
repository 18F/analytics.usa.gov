import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Card from "../Card";

describe("Card", () => {
  describe("when the component has all properties", () => {
    beforeEach(async () => {
      await render(
        <Card id="foobar-id" className="foobar-class">
          <button>child button</button>
        </Card>,
      );
      await waitFor(() => screen.getByRole("listitem"));
    });

    it("renders the children", () => {
      expect(
        screen.getByRole("button", { name: "child button" }),
      ).toBeInTheDocument();
    });

    it("has the passed id on the rendered element", () => {
      expect(screen.getByRole("listitem")).toHaveAttribute("id", "foobar-id");
    });

    it("has the passed class name on the rendered element", () => {
      expect(screen.getByRole("listitem")).toHaveAttribute(
        "class",
        "usa-card foobar-class",
      );
    });
  });

  describe("when the component does not have all properties", () => {
    describe("and the component has no id or class name", () => {
      beforeEach(async () => {
        await render(
          <Card>
            <button>child button</button>
          </Card>,
        );
        await waitFor(() => screen.getByRole("listitem"));
      });

      it("renders the children", () => {
        expect(
          screen.getByRole("button", { name: "child button" }),
        ).toBeInTheDocument();
      });

      it("has no id", () => {
        expect(screen.getByRole("listitem")).not.toHaveAttribute("id");
      });

      it("has only the default class name", () => {
        expect(screen.getByRole("listitem")).toHaveAttribute(
          "class",
          "usa-card ",
        );
      });
    });
  });
});
