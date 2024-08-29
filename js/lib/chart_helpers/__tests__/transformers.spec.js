import assert from "assert";
import transformers from "../transformers";

describe("transformers", () => {
  const sampleArray = [
    { key: "bob", value: 1000 },
    { key: "harry", value: 300 },
    { key: "tom", value: 2 },
  ];

  const proportionArray = [
    { key: "bob", value: 1000, proportion: 76.80491551459293 },
    { key: "harry", value: 300, proportion: 23.04147465437788 },
    { key: "tom", value: 2, proportion: 0.15360983102918588 },
  ];
  describe("listify", () => {
    it("order a list by its key value pairs", () => {
      assert.deepEqual(
        transformers.listify({ bob: 1000, tom: 2, harry: 300 }),
        sampleArray,
      );
    });
  });

  describe("extractArrayValue", () => {
    it("should take an list of objects with the each with keys value and return an arry of values", () => {
      assert.deepEqual(
        transformers.extractArrayValue(sampleArray),
        [1000, 300, 2],
      );
    });

    it("should will include an undefined when not all list items have a value key", () => {
      const badArray = [
        { key: "bob", value: 1000 },
        { key: "harry", toons: 300 },
        { key: "tom", value: 2 },
      ];
      assert.deepEqual(transformers.extractArrayValue(badArray), [
        1000,
        undefined,
        2,
      ]);
    });

    it("will error if just an object", () => {
      const badObject = { key: "bob", value: 1000 };
      assert.throws(() => {
        transformers.extractArrayValue(badObject);
      }, TypeError);
    });
  });

  describe("findProportionsOfMetric", () => {
    it("given a list of objects with some sort of numeric value, return a new list wth the orignal data and the % of the total numeric values", () => {
      function sampleArrayExtract(list) {
        return list.map((item) => item.value);
      }
      assert.deepEqual(
        transformers.findProportionsOfMetric(sampleArray, sampleArrayExtract),
        proportionArray,
      );
    });
  });

  describe("findProportionsOfMetricFromValue", () => {
    it("given a list of objects with some sort of numeric value, return a new list wth the orignal data and the % of the total numeric values", () => {
      assert.deepEqual(
        transformers.findProportionsOfMetricFromValue(sampleArray),
        proportionArray,
      );
    });
  });

  describe("consolidateSmallValues", () => {
    it("does nothing to values that are all greater than the given hold", () => {
      proportionArray[2].proportion = 1.5;
      proportionArray.push({ key: "Other", proportion: 0, children: [] });
      assert.deepEqual(
        transformers.consolidateSmallValues(proportionArray, 1),
        proportionArray,
      );
    });

    it("will group all values below a certain threshold", () => {
      const proportionArraySmall = [
        { key: "bob", value: 1000, proportion: 76.8 },
        { key: "harry", value: 300, proportion: 23.0 },
        { key: "tom", value: 2, proportion: 0.0015 },
        { key: "minnie", value: 2, proportion: 0.0025 },
      ];

      const proportionArrayResult = [
        { key: "bob", value: 1000, proportion: 76.8 },
        { key: "harry", value: 300, proportion: 23.0 },
        { key: "Other", proportion: 0.004, children: [] },
      ];
      assert.deepEqual(
        transformers.consolidateSmallValues(proportionArraySmall, 1),
        proportionArrayResult,
      );
    });
  });

  describe("toTopPercents", () => {
    it("returns the top percents given some data", () => {
      const resultsArray = [
        { key: "bob", value: 1000, proportion: 76.92189350933063 },
        { key: "harry", value: 300, proportion: 23.07656805279919 },
        { key: "Other", proportion: 0.0015384378701866124, children: [] },
      ];

      assert.deepEqual(
        transformers.toTopPercents(
          { totals: { by_os: { bob: 1000, tom: 0.02, harry: 300 } } },
          "os",
        ),
        resultsArray,
      );
    });
  });

  describe("consolidateValuesAfterListLength", () => {
    const values = [
      { country: "United States", proportion: 76.70501259438775 },
      { country: "Puerto Rico", proportion: 0.4809531514965014 },
      { country: "U.S. Virgin Islands", proportion: 0.033111127115861824 },
      { country: "Guam", proportion: 0.018613317220498596 },
      {
        country: "Northern Mariana Islands",
        proportion: 0.0006547398017260811,
      },
      { country: "American Samoa", proportion: 0.000561205544336641 },
    ];

    describe("when maxItems is less than the array length", () => {
      const expected = [
        { country: "United States", proportion: 76.70501259438775 },
        { country: "Puerto Rico", proportion: 0.4809531514965014 },
        { country: "Other", proportion: 0.05294038968242314 },
      ];

      it('consolidates multiple items into the "Other" item', () => {
        expect(
          transformers.consolidateValuesAfterListLength({
            values,
            maxItems: 3,
            labelKey: "country",
          }),
        ).toEqual(expected);
      });
    });
    describe("when maxItems is equal to the array length", () => {
      const expected = [
        { country: "United States", proportion: 76.70501259438775 },
        { country: "Puerto Rico", proportion: 0.4809531514965014 },
        { country: "U.S. Virgin Islands", proportion: 0.033111127115861824 },
        { country: "Guam", proportion: 0.018613317220498596 },
        {
          country: "Northern Mariana Islands",
          proportion: 0.0006547398017260811,
        },
        { country: "Other", proportion: 0.000561205544336641 },
      ];

      it('consolidates multiple items into the "Other" item', () => {
        expect(
          transformers.consolidateValuesAfterListLength({
            values,
            maxItems: 6,
            labelKey: "country",
          }),
        ).toEqual(expected);
      });
    });

    describe("when maxItems is greater than the array length", () => {
      it("returns the original array", () => {
        expect(
          transformers.consolidateValuesAfterListLength({
            values,
            maxItems: 7,
            labelKey: "country",
          }),
        ).toEqual(values);
      });
    });

    describe("when values is omitted", () => {
      it("returns an empty array", () => {
        expect(
          transformers.consolidateValuesAfterListLength({
            maxItems: 7,
            labelKey: "country",
          }),
        ).toEqual([]);
      });
    });

    describe("when maxItems is omitted", () => {
      it("returns the original array", () => {
        expect(
          transformers.consolidateValuesAfterListLength({
            values,
            labelKey: "country",
          }),
        ).toEqual(values);
      });
    });
  });
});
