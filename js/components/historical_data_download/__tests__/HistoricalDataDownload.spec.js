import renderer from "react-test-renderer";
import HistoricalDataDownload from "../HistoricalDataDownload";

jest.mock("export-to-csv", () => {
  return {};
});

describe("HistoricalDataDownload", () => {
  it("renders", () => {
    const component = renderer.create(
      <HistoricalDataDownload
        apiURL="http://www.example.com"
        mainAgencyName="foobar"
        agencies='[{"name":"Agency for International Development","slug":"agency-international-development","_name":"Agency for International Development"}]'
      />,
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
