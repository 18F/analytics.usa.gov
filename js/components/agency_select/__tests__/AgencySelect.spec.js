import renderer from "react-test-renderer";
import AgencySelect from "../AgencySelect";

describe("AgencySelect", () => {
  describe("when all params are provided", () => {
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
