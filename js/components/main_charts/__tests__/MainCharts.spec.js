import renderer from "react-test-renderer";
import MainCharts from "../MainCharts";

describe("MainCharts", () => {
  it("renders", () => {
    const component = renderer.create(
      <MainCharts
        dataURL="http://www.example.com"
        dataPrefix="interior"
        agency="Department of Interior"
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
