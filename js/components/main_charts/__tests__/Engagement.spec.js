import { create, act } from "react-test-renderer";
import Engagement from "../Engagement";

describe("Engagement", () => {
  it("renders", () => {
    let component;
    act(() => {
      component = create(
        <Engagement dataHrefBase="http://www.example.com/data/" />,
      );
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
