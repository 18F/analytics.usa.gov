import { create, act } from "react-test-renderer";
import TopPages from "../TopPages";

describe("TopPages", () => {
  it("renders", () => {
    let component;
    act(() => {
      component = create(
        <TopPages dataHrefBase="http://www.example.com/data/" />,
      );
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
