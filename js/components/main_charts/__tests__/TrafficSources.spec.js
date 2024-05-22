import { create, act } from "react-test-renderer";
import TrafficSources from "../TrafficSources";

describe("TrafficSources", () => {
  it("renders", () => {
    let component;
    act(() => {
      component = create(
        <TrafficSources dataHrefBase="http://www.example.com/data/" />,
      );
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
