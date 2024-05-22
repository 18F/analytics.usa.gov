import { lightFormat, startOfToday } from "date-fns";
import DapApiService from "../dap_api_service";
import ApiDataItemFactory from "../../../spec/factories/api_data_item";

describe("DapApiService", () => {
  const apiPageLimit = 10000;
  const apiURL = "https://www.example.com";
  let subject;

  beforeEach(() => {
    global.fetch = jest.fn();
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
        const expectedURL = `https://www.example.com/agencies/${agency}/reports/${report}/data?after=2017-07-01&before=2017-07-31&limit=${apiPageLimit}&page=1`;
        let actual;

        beforeEach(async () => {
          global.fetch.mockImplementation(() => {
            return Promise.resolve({
              json: () => {
                return mockData;
              },
            });
          });
          actual = await subject.getReportForMonth(report, agency, month, year);
        });

        it("sends a request with the expected params", () => {
          expect(global.fetch).toHaveBeenCalledWith(expectedURL, fetchOptions);
        });

        it("returns the expected data", () => {
          expect(actual).toEqual(mockData);
        });
      });

      describe("and the API has multiple pages of data", () => {
        const mockDataPageOne = ApiDataItemFactory.buildList(apiPageLimit);
        const mockDataPageTwo = ApiDataItemFactory.buildList(apiPageLimit);
        const mockDataPageThree = ApiDataItemFactory.buildList(apiPageLimit);
        const mockDataPageFour = ApiDataItemFactory.buildList(apiPageLimit / 2);
        const expectedData = [
          ...mockDataPageOne,
          ...mockDataPageTwo,
          ...mockDataPageThree,
          ...mockDataPageFour,
        ];
        const expectedURLOne = `https://www.example.com/agencies/${agency}/reports/${report}/data?after=2017-07-01&before=2017-07-31&limit=${apiPageLimit}&page=1`;
        const expectedURLTwo = `https://www.example.com/agencies/${agency}/reports/${report}/data?after=2017-07-01&before=2017-07-31&limit=${apiPageLimit}&page=2`;
        const expectedURLThree = `https://www.example.com/agencies/${agency}/reports/${report}/data?after=2017-07-01&before=2017-07-31&limit=${apiPageLimit}&page=3`;
        const expectedURLFour = `https://www.example.com/agencies/${agency}/reports/${report}/data?after=2017-07-01&before=2017-07-31&limit=${apiPageLimit}&page=4`;
        let actual;

        beforeEach(async () => {
          global.fetch.mockImplementation((URL) => {
            return Promise.resolve({
              json: () => {
                const page = URL.slice(-1);
                if (page === "1") {
                  return mockDataPageOne;
                } else if (page === "2") {
                  return mockDataPageTwo;
                } else if (page === "3") {
                  return mockDataPageThree;
                } else if (page === "4") {
                  return mockDataPageFour;
                }
              },
            });
          });
          actual = await subject.getReportForMonth(report, agency, month, year);
        });

        it("sends a request with the expected URL for page 1", () => {
          expect(global.fetch).toHaveBeenCalledWith(
            expectedURLOne,
            fetchOptions,
          );
        });

        it("sends a request with the expected URL for page 2", () => {
          expect(global.fetch).toHaveBeenCalledWith(
            expectedURLTwo,
            fetchOptions,
          );
        });

        it("sends a request with the expected URL for page 3", () => {
          expect(global.fetch).toHaveBeenCalledWith(
            expectedURLThree,
            fetchOptions,
          );
        });

        it("sends a request with the expected URL for page 4", () => {
          expect(global.fetch).toHaveBeenCalledWith(
            expectedURLFour,
            fetchOptions,
          );
        });

        it("returns the expected data", () => {
          expect(actual).toEqual(expectedData);
        });
      });

      describe("and the time params requested are the current month and year", () => {
        const currentDate = startOfToday();
        // getMonth() returns the month zero-indexed, so add 1. Also add leading
        // zero if needed.
        const thisMonth = (currentDate.getMonth() + 1).toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
        const thisYear = currentDate.getFullYear().toString();
        const startDateString = `${thisYear}-${thisMonth}-01`;
        const endDateString = lightFormat(currentDate, "yyyy-MM-dd");
        const mockData = ApiDataItemFactory.buildList(5);
        const expectedURL = `https://www.example.com/agencies/${agency}/reports/${report}/data?after=${startDateString}&before=${endDateString}&limit=${apiPageLimit}&page=1`;
        let actual;

        beforeEach(async () => {
          global.fetch.mockImplementation(() => {
            return Promise.resolve({
              json: () => {
                return mockData;
              },
            });
          });
          actual = await subject.getReportForMonth(
            report,
            agency,
            thisMonth,
            thisYear,
          );
        });

        it("sends a request with the expected params", () => {
          expect(global.fetch).toHaveBeenCalledWith(expectedURL, fetchOptions);
        });

        it("returns the expected data", () => {
          expect(actual).toEqual(mockData);
        });
      });
    });

    describe("when agency is not provided", () => {
      describe("and the API has one page of data", () => {
        const mockData = ApiDataItemFactory.buildList(2);
        const expectedURL = `https://www.example.com/reports/${report}/data?after=2017-07-01&before=2017-07-31&limit=${apiPageLimit}&page=1`;
        let actual;

        beforeEach(async () => {
          global.fetch.mockImplementation(() => {
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

        it("sends a request with the expected params", () => {
          expect(global.fetch).toHaveBeenCalledWith(expectedURL, fetchOptions);
        });

        it("returns the expected data", () => {
          expect(actual).toEqual(mockData);
        });
      });

      describe("and the API has multiple pages of data", () => {
        const mockDataPageOne = ApiDataItemFactory.buildList(apiPageLimit);
        const mockDataPageTwo = ApiDataItemFactory.buildList(apiPageLimit);
        const mockDataPageThree = ApiDataItemFactory.buildList(apiPageLimit);
        const mockDataPageFour = ApiDataItemFactory.buildList(apiPageLimit / 2);
        const expectedData = [
          ...mockDataPageOne,
          ...mockDataPageTwo,
          ...mockDataPageThree,
          ...mockDataPageFour,
        ];
        const expectedURLOne = `https://www.example.com/reports/${report}/data?after=2017-07-01&before=2017-07-31&limit=${apiPageLimit}&page=1`;
        const expectedURLTwo = `https://www.example.com/reports/${report}/data?after=2017-07-01&before=2017-07-31&limit=${apiPageLimit}&page=2`;
        const expectedURLThree = `https://www.example.com/reports/${report}/data?after=2017-07-01&before=2017-07-31&limit=${apiPageLimit}&page=3`;
        const expectedURLFour = `https://www.example.com/reports/${report}/data?after=2017-07-01&before=2017-07-31&limit=${apiPageLimit}&page=4`;
        let actual;

        beforeEach(async () => {
          global.fetch.mockImplementation((URL) => {
            return Promise.resolve({
              json: () => {
                const page = URL.slice(-1);
                if (page === "1") {
                  return mockDataPageOne;
                } else if (page === "2") {
                  return mockDataPageTwo;
                } else if (page === "3") {
                  return mockDataPageThree;
                } else if (page === "4") {
                  return mockDataPageFour;
                }
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

        it("sends a request with the expected URL for page 1", () => {
          expect(global.fetch).toHaveBeenCalledWith(
            expectedURLOne,
            fetchOptions,
          );
        });

        it("sends a request with the expected URL for page 2", () => {
          expect(global.fetch).toHaveBeenCalledWith(
            expectedURLTwo,
            fetchOptions,
          );
        });

        it("sends a request with the expected URL for page 3", () => {
          expect(global.fetch).toHaveBeenCalledWith(
            expectedURLThree,
            fetchOptions,
          );
        });

        it("sends a request with the expected URL for page 4", () => {
          expect(global.fetch).toHaveBeenCalledWith(
            expectedURLFour,
            fetchOptions,
          );
        });

        it("returns the expected data", () => {
          expect(actual).toEqual(expectedData);
        });
      });

      describe("and the time params requested are the current month and year", () => {
        const currentDate = startOfToday();
        // getMonth() returns the month zero-indexed, so add 1. Also add leading
        // zero if needed.
        const thisMonth = (currentDate.getMonth() + 1).toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
        const thisYear = currentDate.getFullYear().toString();
        const startDateString = `${thisYear}-${thisMonth}-01`;
        const endDateString = lightFormat(currentDate, "yyyy-MM-dd");
        const mockData = ApiDataItemFactory.buildList(5);
        const expectedURL = `https://www.example.com/reports/${report}/data?after=${startDateString}&before=${endDateString}&limit=${apiPageLimit}&page=1`;
        let actual;

        beforeEach(async () => {
          global.fetch.mockImplementation(() => {
            return Promise.resolve({
              json: () => {
                return mockData;
              },
            });
          });
          actual = await subject.getReportForMonth(
            report,
            undefined,
            thisMonth,
            thisYear,
          );
        });

        it("sends a request with the expected params", () => {
          expect(global.fetch).toHaveBeenCalledWith(expectedURL, fetchOptions);
        });

        it("returns the expected data", () => {
          expect(actual).toEqual(mockData);
        });
      });
    });
  });
});
