import renderer from "react-test-renderer";
import DataDownloads from "../DataDownloads";

describe("DataDownloads", () => {
  it("renders", () => {
    const component = renderer.create(
      <DataDownloads dataURL="http://www.example.com" dataPrefix="foobar" />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
