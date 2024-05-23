import { create, act } from "react-test-renderer";
import LocationsAndLanguages from "../LocationsAndLanguages";

describe("LocationsAndLanguages", () => {
  it("renders", () => {
    let component;
    act(() => {
      component = create(
        <LocationsAndLanguages dataHrefBase="http://www.example.com/data/" />,
      );
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
