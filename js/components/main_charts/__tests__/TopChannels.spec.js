import renderer from "react-test-renderer";
import TopChannels from "../TopChannels";

describe("TopChannels", () => {
  it("renders", () => {
    const component = renderer.create(
      <TopChannels dataHrefBase="http://www.example.com/data/" />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
