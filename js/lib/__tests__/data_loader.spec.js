import DataLoader from "../data_loader";
import ReportFactory from "../../../spec/factories/report";

describe("DataLoader", () => {
  let subject;

  beforeEach(() => {
    global.fetch = jest.fn();
    subject = DataLoader;
  });

  describe("loadJSON", () => {
    const fetchOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "error",
    };

    describe("when url is missing", () => {
      let actual;

      beforeEach(async () => {
        try {
          actual = await subject.loadJSON();
        } catch (error) {
          actual = error;
        }
      });

      it("throws", () => {
        expect(actual).toEqual("Invalid URL");
      });
    });

    describe("when URL is provided", () => {
      const mockData = ReportFactory.build();
      const url = "https://www.example.com/reports";
      let actual;

      beforeEach(async () => {
        global.fetch.mockImplementation(() => {
          return Promise.resolve({
            json: () => {
              return mockData;
            },
          });
        });
        actual = await subject.loadJSON(url);
      });

      it("sends a request with the expected params", () => {
        expect(global.fetch).toHaveBeenCalledWith(url, fetchOptions);
      });

      it("returns the expected data", () => {
        expect(actual).toEqual(mockData);
      });
    });
  });
});
