import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AccordionHeader from "../AccordionHeader";

describe("AccordionHeader", () => {
  beforeEach(() => {
    window.gas4 = jest.fn(() => {});
  });

  describe("rendering", () => {
    describe("when the component has all props", () => {
      beforeEach(async () => {
        await render(
          <AccordionHeader
            id="foobar-id"
            className="foobar-class"
            headingLevel={3}
          >
            <button>child button</button>
          </AccordionHeader>,
        );
        await waitFor(() => screen.getByRole("heading"));
      });

      it("creates an element with the correct heading level", () => {
        expect(screen.getByRole("heading").tagName).toBe("H3");
      });

      it("renders the children", () => {
        expect(
          screen.getByRole("button", { name: "child button" }),
        ).toBeInTheDocument();
      });

      it("has the passed id on the rendered element", () => {
        expect(screen.getByRole("heading")).toHaveAttribute("id", "foobar-id");
      });

      it("has the passed class name on the rendered element", () => {
        expect(screen.getByRole("heading")).toHaveAttribute(
          "class",
          "usa-accordion__heading foobar-class",
        );
      });
    });

    describe("when the component has only the minimum all props", () => {
      beforeEach(async () => {
        await render(
          <AccordionHeader>
            <button>child button</button>
          </AccordionHeader>,
        );
        await waitFor(() => screen.getByRole("heading"));
      });

      it("creates an element with the default heading level", () => {
        expect(screen.getByRole("heading").tagName).toBe("H2");
      });

      it("renders the children", () => {
        expect(
          screen.getByRole("button", { name: "child button" }),
        ).toBeInTheDocument();
      });

      it("has no id on the rendered element", () => {
        expect(screen.getByRole("heading")).not.toHaveAttribute("id");
      });

      it("has the default class name on the rendered element", () => {
        expect(screen.getByRole("heading")).toHaveAttribute(
          "class",
          "usa-accordion__heading ",
        );
      });
    });
  });

  describe("click handling", () => {
    describe("when the accordion button is expanded", () => {
      beforeEach(async () => {
        await render(
          <AccordionHeader>
            <button aria-expanded="true">child button</button>
          </AccordionHeader>,
        );
        await waitFor(() => screen.getByRole("heading"));
        fireEvent.click(screen.getByRole("button"), {
          target: { innerText: "foo", ariaExpanded: "true" },
        });
      });

      it("sends an analytics event for the accordion click", () => {
        expect(window.gas4).toHaveBeenCalledWith("accordion_click", {
          section: "foo",
          selection: false,
        });
      });
    });

    describe("when accordion button is not expanded", () => {
      beforeEach(async () => {
        await render(
          <AccordionHeader>
            <button aria-expanded="false">child button</button>
          </AccordionHeader>,
        );
        await waitFor(() => screen.getByRole("heading"));
        fireEvent.click(screen.getByRole("button"), {
          target: { innerText: "bar", ariaExpanded: "false" },
        });
      });

      it("sends an analytics event for the accordion click", () => {
        expect(window.gas4).toHaveBeenCalledWith("accordion_click", {
          section: "bar",
          selection: true,
        });
      });
    });

    describe("when accordion button does not have an aria-expanded property", () => {
      beforeEach(async () => {
        await render(
          <AccordionHeader>
            <button aria-expanded="false">child button</button>
          </AccordionHeader>,
        );
        await waitFor(() => screen.getByRole("heading"));
        fireEvent.click(screen.getByRole("button"), {
          target: { innerText: "baz" },
        });
      });

      it("sends an analytics event for the accordion click with undefined selection", () => {
        expect(window.gas4).toHaveBeenCalledWith("accordion_click", {
          section: "baz",
        });
      });
    });
  });
});
