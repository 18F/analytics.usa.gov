import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CardContent from "../CardContent";

describe("CardContent", () => {
  describe("when the component has all properties", () => {
    beforeEach(async () => {
      await render(
        <CardContent id="foobar-id" className="foobar-class">
          <button>child button</button>
        </CardContent>,
      );
      await waitFor(() => screen.getAllByRole("generic"));
    });

    it("renders the children", () => {
      expect(
        screen.getByRole("button", { name: "child button" }),
      ).toBeInTheDocument();
    });

    it("has the passed id on the rendered element", () => {
      expect(screen.getAllByRole("generic")[1]).toHaveAttribute(
        "id",
        "foobar-id",
      );
    });

    it("has the passed class name on the rendered element", () => {
      expect(screen.getAllByRole("generic")[1]).toHaveAttribute(
        "class",
        "usa-card__container foobar-class",
      );
    });
  });

  describe("when the component does not have all propertie", () => {
    describe("and the component has no id or class name", () => {
      beforeEach(async () => {
        await render(
          <CardContent>
            <button>child button</button>
          </CardContent>,
        );
        await waitFor(() => screen.getAllByRole("generic"));
      });

      it("renders the children", () => {
        expect(
          screen.getByRole("button", { name: "child button" }),
        ).toBeInTheDocument();
      });

      it("has no id", () => {
        expect(screen.getAllByRole("generic")[1]).not.toHaveAttribute("id");
      });

      it("has only the default class name", () => {
        expect(screen.getAllByRole("generic")[1]).toHaveAttribute(
          "class",
          "usa-card__container ",
        );
      });
    });
  });
});
