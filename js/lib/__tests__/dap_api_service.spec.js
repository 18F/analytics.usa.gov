import DapApiService from "../dap_api_service";
import ApiDataItemFactory from "../../../spec/factories/api_data_item";

describe("DapApiService", () => {
  const apiURL = "https://www.example.com";
  let subject;

  beforeEach(() => {
    subject = new DapApiService(apiURL);
  });

  describe("getReportForMonth", () => {
    const report = "download";
    const agency = "interior";
    const month = "7";
    const year = "2017";
    const fetchOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "error",
    };

    describe("when required params are missing", () => {
      describe("when report is missing", () => {
        let actual;

        beforeEach(async () => {
          try {
            actual = await subject.getReportForMonth(
              undefined,
              agency,
              month,
              year,
            );
          } catch (error) {
            actual = error;
          }
        });

        it("throws", () => {
          expect(actual).toEqual("Missing required params for report API call");
        });
      });

      describe("when month is missing", () => {
        let actual;

        beforeEach(async () => {
          try {
            actual = await subject.getReportForMonth(
              report,
              agency,
              undefined,
              year,
            );
          } catch (error) {
            actual = error;
          }
        });

        it("throws", () => {
          expect(actual).toEqual("Missing required params for report API call");
        });
      });
      describe("when year is missing", () => {
        let actual;

        beforeEach(async () => {
          try {
            actual = await subject.getReportForMonth(
              report,
              agency,
              month,
              undefined,
            );
          } catch (error) {
            actual = error;
          }
        });

        it("throws", () => {
          expect(actual).toEqual("Missing required params for report API call");
        });
      });
    });

    describe("when agency is provided", () => {
      describe("and the API has one page of data", () => {
        const mockData = ApiDataItemFactory.buildList(5);
        const expectedURL = `https://www.example.com/agencies/${agency}/reports/${report}/data?after=2017-07-01&before=2017-07-31&limit=10000&page=1`;
        let requestURL;
        let requestOptions;
        let actual;

        beforeEach(async () => {
          global.fetch = jest.fn((URL, options) => {
            requestURL = URL;
            requestOptions = options;
            return Promise.resolve({
              json: () => {
                return mockData;
              },
            });
          });
          actual = await subject.getReportForMonth(report, agency, month, year);
        });

        it("sends a request with the expected URL", () => {
          expect(requestURL).toEqual(expectedURL);
        });

        it("sends a request with the expected options", () => {
          expect(requestOptions).toEqual(fetchOptions);
        });

        it("returns the expected data", () => {
          expect(actual).toEqual(mockData);
        });
      });

      describe("and the API has mutliple pages of data", () => {
        describe("and the API has one page of data", () => {});
      });
    });

    describe("when agency is not provided", () => {
      describe("and the API has one page of data", () => {
        const mockData = ApiDataItemFactory.buildList(2);
        const expectedURL = `https://www.example.com/reports/${report}/data?after=2017-07-01&before=2017-07-31&limit=10000&page=1`;
        let requestURL;
        let requestOptions;
        let actual;

        beforeEach(async () => {
          global.fetch = jest.fn((URL, options) => {
            requestURL = URL;
            requestOptions = options;
            return Promise.resolve({
              json: () => {
                return mockData;
              },
            });
          });
          actual = await subject.getReportForMonth(
            report,
            undefined,
            month,
            year,
          );
        });

        it("sends a request with the expected URL", () => {
          expect(requestURL).toEqual(expectedURL);
        });

        it("sends a request with the expected options", () => {
          expect(requestOptions).toEqual(fetchOptions);
        });

        it("returns the expected data", () => {
          expect(actual).toEqual(mockData);
        });
      });
    });
  });
});
