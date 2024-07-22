import React from "react";
import { create, act } from "react-test-renderer";
import DeviceDemographics from "../DeviceDemographics";

describe("DeviceDemographics", () => {
  it("renders", () => {
    let component;
    act(() => {
      component = create(
        <DeviceDemographics dataHrefBase="http://www.example.com/data/" />,
      );
    });
    expect(component.toJSON()).toMatchSnapshot();
  });
});
