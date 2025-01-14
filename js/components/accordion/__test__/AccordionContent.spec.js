import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import AccordionContent from "../AccordionContent";

describe("AccordionContent", () => {
  describe("when the component has all properties", () => {
    beforeEach(async () => {
      await render(
        <AccordionContent id="foobar-id" className="foobar-class">
          <button>child button</button>
        </AccordionContent>,
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
        "usa-accordion__content foobar-class",
      );
    });
  });

  describe("when the component does not have all properties", () => {
    describe("and the component has no id or class name", () => {
      beforeEach(async () => {
        await render(
          <AccordionContent>
            <button>child button</button>
          </AccordionContent>,
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
          "usa-accordion__content ",
        );
      });
    });
  });
});
