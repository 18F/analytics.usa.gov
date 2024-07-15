import DapApiDataFormatter from "../dap_api_data_formatter";
import ApiDataItemFactory from "../../../spec/factories/api_data_item";

// Eslint doesn't like the way we remove notice/id keys from the data objects.
// TODO: Fix this to be compliant, or disable the ESLint rule in a better way.
/* eslint-disable no-unused-vars */
describe("DapApiDataFormatter", () => {
  const reports = [{ name: "Top Downloads", value: "download" }];
  const agencies = [{ name: "Department of Interior", value: "interior" }];

  let subject;

  beforeEach(() => {
    subject = new DapApiDataFormatter(reports, agencies);
  });

  describe("mapForDisplay", () => {
    describe("when data items include agency", () => {
      describe("and data items match a report and agency", () => {
        const mockData = ApiDataItemFactory.params({
          report_name: reports[0].value,
          report_agency: agencies[0].value,
        }).buildList(5);
        let actual;

        beforeEach(() => {
          actual = subject.mapForDisplay(mockData);
        });

        it("returns the expected data with report and agency mapped", () => {
          expect(actual).toEqual(
            mockData.map(({ notice, id, ...remaining }) => {
              return {
                ...remaining,
                report_name: reports[0].name,
                report_agency: agencies[0].name,
              };
            }),
          );
        });
      });

      describe("and data items do not match report", () => {
        const mockData = ApiDataItemFactory.params({
          report_agency: agencies[0].value,
        }).buildList(5);
        let actual;

        beforeEach(() => {
          actual = subject.mapForDisplay(mockData);
        });

        it("returns the expected data with agency mapped", () => {
          expect(actual).toEqual(
            mockData.map(({ notice, id, ...remaining }) => {
              return {
                ...remaining,
                report_agency: agencies[0].name,
              };
            }),
          );
        });
      });

      describe("and data items do not match agency", () => {
        const mockData = ApiDataItemFactory.params({
          report_name: reports[0].value,
        }).buildList(5);
        let actual;

        beforeEach(() => {
          actual = subject.mapForDisplay(mockData);
        });

        it("returns the expected data with report mapped", () => {
          expect(actual).toEqual(
            mockData.map(({ notice, id, ...remaining }) => {
              return {
                ...remaining,
                report_name: reports[0].name,
              };
            }),
          );
        });
      });

      describe("and data items do not match report or agency", () => {
        const mockData = ApiDataItemFactory.buildList(5);
        let actual;

        beforeEach(() => {
          actual = subject.mapForDisplay(mockData);
        });

        it("returns the expected data with report mapped", () => {
          expect(actual).toEqual(
            mockData.map(({ notice, id, ...remaining }) => {
              return {
                ...remaining,
              };
            }),
          );
        });
      });
    });

    describe("when data items do not include agency", () => {
      describe("and data items match a report", () => {
        const mockData = ApiDataItemFactory.params({
          report_name: reports[0].value,
          report_agency: null,
        }).buildList(10);
        let actual;

        beforeEach(async () => {
          actual = await subject.mapForDisplay(mockData);
        });

        it("returns the expected data with report mapped", () => {
          expect(actual).toEqual(
            mockData.map(({ notice, id, ...remaining }) => {
              return {
                ...remaining,
                report_name: reports[0].name,
              };
            }),
          );
        });
      });

      describe("and data items do not match a report", () => {
        const mockData = ApiDataItemFactory.params({
          report_agency: null,
        }).buildList(10);
        let actual;

        beforeEach(async () => {
          actual = await subject.mapForDisplay(mockData);
        });

        it("returns the expected data", () => {
          expect(actual).toEqual(
            mockData.map(({ notice, id, ...remaining }) => {
              return {
                ...remaining,
              };
            }),
          );
        });
      });
    });

    describe("when the data array is empty", () => {
      const mockData = [];
      let actual;

      beforeEach(async () => {
        actual = await subject.mapForDisplay(mockData);
      });

      it("returns the unaltered data", () => {
        expect(actual).toEqual(mockData);
      });
    });
  });
});
/* eslint-enable no-unused-vars */
