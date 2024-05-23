import { create, act } from "react-test-renderer";
import RealtimeVisitors from "../RealtimeVisitors";

describe("RealtimeVisitors", () => {
  it("renders", () => {
    let component;
    act(() => {
      component = create(
        <RealtimeVisitors
          dataHrefBase="http://www.example.com/data/"
          agency="Department of Defense"
        />,
      );
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
