import { isPartOfUnitedStates, US_AND_TERRITORIES } from "../territories";

describe("isPartOfUnitedStates", () => {
  describe("when country name is in US_AND_TERRITORIES", () => {
    US_AND_TERRITORIES.forEach((countryName) => {
      describe(`and country name is ${countryName}`, () => {
        it("returns true", () => {
          expect(isPartOfUnitedStates(countryName)).toBe(true);
        });
      });

      describe(`and country name is ${countryName.toUpperCase()}`, () => {
        it("returns false", () => {
          expect(isPartOfUnitedStates(countryName.toUpperCase())).toBe(false);
        });
      });

      describe(`and country name is ${countryName.toLowerCase()}`, () => {
        it("returns false", () => {
          expect(isPartOfUnitedStates(countryName.toLowerCase())).toBe(false);
        });
      });
    });
  });

  describe("when country name is empty string", () => {
    it("returns false", () => {
      expect(isPartOfUnitedStates("")).toBe(false);
    });
  });

  describe("when country name is null", () => {
    it("returns false", () => {
      expect(isPartOfUnitedStates(null)).toBe(false);
    });
  });

  describe("when country name is undefined", () => {
    it("returns false", () => {
      expect(isPartOfUnitedStates(undefined)).toBe(false);
    });
  });
});
