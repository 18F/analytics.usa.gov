import React from "react";
import renderer from "react-test-renderer";
import AgencySelect from "../AgencySelect";

describe("AgencySelect", () => {
  describe("when all params are provided", () => {
    describe("and subagencies exist", () => {
      it("renders", () => {
        const component = renderer.create(
          <AgencySelect
            pathSuffix="/data"
            mainAgencyName="foobar"
            agencies='[{"name":"Agency for International Development","slug":"agency-international-development","_name":"Agency for International Development"},{"name": "Department of the Interior","slug": "interior","redirect_from":["doi"]},{"name": "National Park Service","slug": "national-park-service","parent": "interior"}]'
          />,
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
      });
    });

    describe("and subagencies do not exist", () => {
      it("renders", () => {
        const component = renderer.create(
          <AgencySelect
            pathSuffix="/data"
            mainAgencyName="foobar"
            agencies='[{"name":"Agency for International Development","slug":"agency-international-development","_name":"Agency for International Development"}]'
          />,
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
      });
    });
  });

  describe("when optional params are not provided", () => {
    it("renders", () => {
      const component = renderer.create(
        <AgencySelect
          pathSuffix=""
          mainAgencyName="foobar"
          agencies='[{"name":"Agency for International Development","slug":"agency-international-development","_name":"Agency for International Development"}]'
        />,
      );
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
