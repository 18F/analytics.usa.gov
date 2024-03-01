import assert from "assert";
import formatters from "../js/lib/formatters";

describe("Formatters", () => {
  describe("trimZeros", () => {
    it("should not do anything to a number that has no zeros", () => {
      assert.equal(formatters.trimZeroes("25"), "25");
    });

    it("should not do anything to a number that has zeros in the middle of it", () => {
      assert.equal(formatters.trimZeroes("205"), "205");
    });

    it("should not do anything trailing zeros over the decimal", () => {
      assert.equal(formatters.trimZeroes("2050"), "2050");
    });

    it("should remove trailing zeros below a decimal point", () => {
      assert.equal(formatters.trimZeroes("52.000"), "52");
    });
  });

  describe("addCommas", () => {
    it("should not do anything to a number is under one thousand", () => {
      assert.equal(formatters.addCommas("25"), "25");
    });

    it("should one zero for a number that is between one million and one thousand", () => {
      assert.equal(formatters.addCommas("1205"), "1,205");
    });

    it("should two zeros for a number between a billion and one million", () => {
      assert.equal(formatters.addCommas("5200000"), "5,200,000");
    });
  });

  describe("formatVisits", () => {
    it("should convert 1 thousand to 1k", () => {
      assert.equal(formatters.formatVisits()("1200"), "1.2k");
    });

    it("should not do anything to a number under 1,000", () => {
      assert.equal(formatters.formatVisits()("205"), "205");
    });

    it("should give a 1 decimal float for a number in the millions", () => {
      assert.equal(formatters.formatVisits()("5200000"), "5.2m");
    });

    it("should give a 2 decimal float for a number in the billions", () => {
      assert.equal(formatters.formatVisits()("5250000000"), "5.25b");
    });
  });

  describe("readableBigNumbers", () => {
    it("add a comma a number in the thousands", () => {
      assert.equal(formatters.readableBigNumber("1200"), "1,200");
    });

    it("should not do anything to a number under 1,000", () => {
      assert.equal(formatters.readableBigNumber("205"), "205");
    });

    it("should give a 1 decimal float for a number in the millions", () => {
      assert.equal(formatters.readableBigNumber("5200000"), "5.2 million");
    });

    it("should give a 2 decimal float for a number in the billions", () => {
      assert.equal(formatters.readableBigNumber("5250000000"), "5.25 billion");
    });
  });

  describe("floatToPercent", () => {
    it("adds a percent sign and chops off the decimal of a float", () => {
      assert.equal(formatters.floatToPercent(12.0), "12%");
    });

    it("convert a float into a percent with one decimal point", () => {
      assert.equal(formatters.floatToPercent(0.205), "0.2%");
    });

    it("should display 0.1% to a number less than 0.1%", () => {
      assert.equal(formatters.floatToPercent(0.0002), "< 0.1%");
    });
  });

  describe("formatHour", () => {
    it("returns the hour and a to a morning hour", () => {
      assert.equal(formatters.formatHour(11), "11a");
    });

    it("returns the hour and a to an afternoon /eveninghour", () => {
      assert.equal(formatters.formatHour(23), "11p");
    });

    it("errors if the number is too high", () => {
      assert.equal(formatters.formatHour(32), "8p");
    });
  });

  describe("formatURL", () => {
    it("returns a clean url without a port and the site suffix", () => {
      assert.equal(
        formatters.formatURL("https://www.irs.gov:8443/cool-change"),
        "www.irs.gov",
      );
    });

    it("returns the same for a clean url", () => {
      assert.equal(formatters.formatURL("dotgov.gov"), "dotgov.gov");
    });
  });

  describe("formatFile", () => {
    it("returns the file name from a given url", () => {
      assert.equal(
        formatters.formatFile("https://www.irs.gov:8443/ds82.pdf"),
        "/ds82.pdf",
      );
    });

    it("returns the same for a clean url", () => {
      assert.equal(formatters.formatFile("dotgov.gov"), "dotgov.gov");
    });
  });
});
