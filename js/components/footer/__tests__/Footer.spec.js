import renderer from "react-test-renderer";
import Footer from "../Footer";

describe("Footer", () => {
  it("renders", () => {
    const component = renderer.create(
      <Footer siteDomain="http://www.example.com" />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
