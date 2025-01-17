import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Accordion from "../Accordion";

describe("Accordion", () => {
  describe("when the component has children", () => {
    beforeEach(async () => {
      await render(
        <Accordion id="foobar-id" className="foobar-class" multiselect={true}>
          <button>child button</button>
        </Accordion>,
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
        "usa-accordion usa-accordion--multiselectable foobar-class",
      );
    });

    it("has the passed data-allow-multiple on the rendered element", () => {
      expect(screen.getAllByRole("generic")[1]).toHaveAttribute(
        "data-allow-multiple",
        "true",
      );
    });
  });

  describe("when the component does not have children", () => {
    describe("and the component has no id or class name", () => {
      beforeEach(async () => {
        await render(<Accordion />);
        await waitFor(() => screen.getAllByRole("generic"));
      });

      it("has no id", () => {
        expect(screen.getAllByRole("generic")[1]).not.toHaveAttribute("id");
      });

      it("has only the default class name", () => {
        expect(screen.getAllByRole("generic")[1]).toHaveAttribute(
          "class",
          "usa-accordion ",
        );
      });
    });

    describe("and the component has an id and className props", () => {
      beforeEach(async () => {
        await render(<Accordion id="foobar-id" className="foobar-class" />);
        await waitFor(() => screen.getAllByRole("generic"));
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
          "usa-accordion foobar-class",
        );
      });
    });
  });
});
