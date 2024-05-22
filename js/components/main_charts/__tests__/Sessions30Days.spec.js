import { create, act } from "react-test-renderer";
import Sessions30Days from "../Sessions30Days";

describe("Sessions30Days", () => {
  it("renders", () => {
    let component;
    act(() => {
      component = create(
        <Sessions30Days dataHrefBase="http://www.example.com/data/" />,
      );
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
